from django.db import transaction
from django.http import HttpRequest
from rest_framework import viewsets, permissions, exceptions

from user import models as user_models, serializers as user_serializers, permissions as user_permissions
from finance import models as finance_models
from . import models, serializers


class PublicTherapistRL(viewsets.ReadOnlyModelViewSet):
    queryset = user_models.Therapist.objects.filter(is_approved=True)
    serializer_class = user_serializers.PublicTherapistSerializer
    permission_classes = (permissions.AllowAny,)


class BaseReservationViewSet(viewsets.ModelViewSet):
    queryset = models.Reservation.objects.all()
    serializer_class = serializers.ReservationSerializer

    @transaction.atomic
    def perform_destroy(self, reservation: models.Reservation):
        if reservation.state == models.Reservation.State.ATTENDED:
            raise exceptions.PermissionDenied('You cannot delete an attended reservation.')

        if reservation.state == models.Reservation.State.CANCELLED:
            return

        reservation_transaction: finance_models.ReservationTransaction = \
            finance_models.ReservationTransaction.objects.get(reservation=reservation)
        reservation_transaction.is_rollbacked = True
        reservation_transaction.save()

        reservation.state = models.Reservation.State.CANCELLED
        reservation.save()

        therapist_wallet: finance_models.Wallet = finance_models.Wallet.objects.get(user=reservation.therapist.user)
        therapist_wallet.balance -= reservation_transaction.amount
        therapist_wallet.save()

        client_wallet: finance_models.Wallet = finance_models.Wallet.objects.get(user=reservation.client.user)
        client_wallet.balance += reservation_transaction.amount
        client_wallet.save()


class ClientReservation(BaseReservationViewSet):
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsClient)

    def get_queryset(self):
        return super().get_queryset().filter(client=self.request.user.client)

    def create(self, request: HttpRequest, *args, **kwargs):
        request.POST._mutable = True
        request.data['client'] = request.user.id
        request.POST._mutable = False
        return super().create(request, *args, **kwargs)


class TherapistReservation(BaseReservationViewSet):
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsTherapist)

    def get_queryset(self):
        return super().get_queryset().filter(therapist=self.request.user.therapist)
