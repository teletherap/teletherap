from datetime import datetime, timedelta
from uuid import uuid4

from django.db import transaction
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import serializers


from .models import Reservation
from user.models import Therapist, Client
from finance.models import ReservationTransaction, Wallet


class PublicReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('therapist', 'datetime', 'current_state')


class ReservationSerializer(serializers.ModelSerializer):
    current_state = serializers.CharField(read_only=True)
    therapist_name = serializers.SerializerMethodField()
    client_name = serializers.SerializerMethodField()

    def get_therapist_name(self, obj: Reservation):
        return f'{obj.therapist.user.first_name} {obj.therapist.user.last_name}'

    def get_client_name(self, obj: Reservation):
        return f'{obj.client.user.first_name} {obj.client.user.last_name}'

    class Meta:
        model = Reservation
        fields = ('id', 'client', 'therapist', 'datetime', 'communication_type', 'current_state',
                  'therapist_name', 'client_name')

    def validate(self, attrs):
        therapist = get_object_or_404(Therapist, pk=attrs['therapist'])
        d: datetime = attrs['datetime']
        if Reservation.objects.filter(therapist=therapist,
                                      state=Reservation.State.RESERVED,
                                      datetime__gt=d - timedelta(hours=1),
                                      datetime__lte=d).exists():
            raise serializers.ValidationError({'datetime': 'Therapist is already reserved at this time.'})

        if d.time() < therapist.daily_start_time or (d + timedelta(hours=1)).time() > therapist.daily_end_time:
            raise serializers.ValidationError({'datetime': 'Therapist is not available at this time.'})

        client = get_object_or_404(Client, pk=attrs['client'])
        if client.user.wallet.balance < therapist.price_per_session:
            raise serializers.ValidationError('You do not have enough balance in your wallet.')

        return super().validate(attrs)

    def validate_datetime(self, value):
        if value < timezone.now():
            raise serializers.ValidationError('Reservation date must be in the future.')
        return value

    @transaction.atomic
    def create(self, validated_data):
        if validated_data['communication_type'] == Reservation.CommunicationType.VIDEO:
            validated_data['url_for_client'] = \
                validated_data['url_for_therapist'] = \
                f'https://meet.jit.si/teletherap-{uuid4()}'
        else:
            therapist = get_object_or_404(Therapist, pk=validated_data['therapist'])
            validated_data['url_for_client'] = f'https://t.me/{therapist.telegram_username}'
            client = get_object_or_404(Client, pk=validated_data['client'])
            validated_data['url_for_therapist'] = f'https://t.me/{client.telegram_username}'

        reservation: Reservation = super().create(validated_data)
        reservation_transaction = ReservationTransaction.objects.create(reservation=reservation,
                                                                        amount=reservation.therapist.price_per_session)

        therapist_wallet: Wallet = Wallet.objects.get(user=reservation.therapist.user)
        therapist_wallet.balance += reservation_transaction.amount
        therapist_wallet.save()

        client_wallet: Wallet = Wallet.objects.get(user=reservation.client.user)
        client_wallet.balance -= reservation_transaction.amount
        client_wallet.save()

        return reservation

