from django.contrib.auth.models import User
from django.http import HttpRequest
from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, mixins, views, response, status
from rest_framework_simplejwt.views import TokenObtainPairView

from . import serializers, permissions as user_permissions, models


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.MyTokenObtainPairSerializer


class ClientRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.ClientRegisterSerializer


class TherapistRegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = serializers.TherapistRegisterSerializer


class PrivateTherapistRU(generics.RetrieveUpdateAPIView):
    queryset = models.Therapist
    permission_classes = (permissions.IsAuthenticated, user_permissions.IsTherapist)
    serializer_class = serializers.PrivateTherapistSerializer

    def get_object(self):
        therapist = self.request.user.therapist
        self.check_object_permissions(self.request, therapist)
        return therapist


class TherapistDocumentCD(mixins.CreateModelMixin, mixins.DestroyModelMixin, generics.GenericAPIView):
    queryset = models.TherapistDocuments
    permission_classes = (permissions.IsAuthenticated,
                          user_permissions.IsTherapist,
                          user_permissions.IsDocumentOwner)
    serializer_class = serializers.TherapistDocumentsSerializer

    def post(self, request, *args, **kwargs):
        request.data['therapist'] = request.user.id
        return self.create(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        return self.destroy(request, *args, **kwargs)


class AccountVerification(views.APIView):
    def get(self, request: HttpRequest, username: str, token: str, *args, **kwargs):
        user = get_object_or_404(User, username=username)
        if user.is_active:
            return response.Response({}, status=status.HTTP_200_OK)

        activation = models.AccountActivation.objects.filter(user=user, activation_key=token)
        if activation.exists():
            user.is_active = True
            user.save()
            activation.delete()
            return response.Response({}, status=status.HTTP_200_OK)
        return response.Response({
            'error': f'Invalid token for user {username}'
        }, status=status.HTTP_403_FORBIDDEN)
