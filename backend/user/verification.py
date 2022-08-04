from uuid import uuid4

from django.conf import settings
from django.contrib.auth.models import User
from django.core.mail import send_mail

from .models import AccountActivation


class Verifier:

    def __init__(self, user: User) -> None:
        self.__user = user

    def __generate_token(self) -> str:
        token = str(uuid4())
        AccountActivation.objects.create(user=self.__user, activation_key=token)
        return token

    def send_verification_email(self) -> None:
        token = self.__generate_token()
        send_mail(
            'Activate your account',
            f'Please click the link to activate your account: {settings.BASE_URL}/api/user/{self.__user.username}/{settings.VERIFICATION_PATH}/{token}',
            settings.EMAIL_HOST_USER,
            [self.__user.email],
            fail_silently=False)
