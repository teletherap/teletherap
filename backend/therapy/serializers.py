from datetime import datetime, timedelta

from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework import serializers

from .models import Reservation
from user.models import Therapist


class PublicReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('therapist', 'datetime', 'state')


class ClientReservationSerializer(serializers.ModelSerializer):
    state = serializers.CharField(read_only=True)

    class Meta:
        model = Reservation
        fields = ('id', 'client', 'therapist', 'datetime', 'communication_type', 'state')

    def validate(self, attrs):
        therapist = get_object_or_404(Therapist, pk=attrs['therapist'])
        d: datetime = attrs['datetime']
        if Reservation.objects.filter(therapist=therapist,
                                      datetime__gt=d - timedelta(hours=1),
                                      datetime__lte=d).exists():
            raise serializers.ValidationError({'datetime': 'Therapist is already reserved at this time.'})

        if d.time() < therapist.daily_start_time or (d + timedelta(hours=1)).time() > therapist.daily_end_time:
            raise serializers.ValidationError({'datetime': 'Therapist is not available at this time.'})

        return super().validate(attrs)

    def validate_datetime(self, value):
        if value < timezone.now():
            raise serializers.ValidationError('Reservation date must be in the future.')
        return value


class TherapistReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('id', 'client', 'therapist', 'datetime', 'communication_type', 'state')
