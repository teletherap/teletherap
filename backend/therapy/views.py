from django.http import HttpRequest
from rest_framework import viewsets, permissions, exceptions

from user import models as user_models, serializers as user_serializers, permissions as user_permissions
from . import models, serializers


class PublicTherapistRL(viewsets.ReadOnlyModelViewSet):
    queryset = user_models.Therapist.objects.filter(is_approved=True)
    serializer_class = user_serializers.PublicTherapistSerializer
    permission_classes = (permissions.AllowAny,)


class BaseReservationViewSet(viewsets.ModelViewSet):
    queryset = models.Reservation.objects.all()
    serializer_class = serializers.ClientReservationSerializer

    def perform_destroy(self, instance: models.Reservation):
        if instance.state == models.Reservation.State.ATTENDED:
            raise exceptions.PermissionDenied('You cannot delete an attended reservation.')
        instance.state = models.Reservation.State.CANCELLED
        instance.save()


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
