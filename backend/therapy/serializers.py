from rest_framework import serializers

from .models import Reservation


class PublicReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ('therapist', 'datetime', 'state')
