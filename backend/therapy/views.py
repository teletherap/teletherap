from rest_framework import viewsets, permissions

from user import models as user_models, serializers as user_serializers


class PublicTherapistRL(viewsets.ReadOnlyModelViewSet):
    queryset = user_models.Therapist.objects.filter(is_approved=True)
    serializer_class = user_serializers.PublicTherapistSerializer
    permission_classes = (permissions.AllowAny,)
