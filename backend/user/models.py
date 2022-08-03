from django.db import models
from django.core.validators import RegexValidator


# Create your models here.
class Client(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,
                                related_name='client',
                                primary_key=True)


class Therapist(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,
                                related_name='therapist',
                                primary_key=True)
    description = models.TextField(blank=True, null=True)
    telegram_username = models.CharField(max_length=255, null=True, validators=[
                                         RegexValidator(r'^([a-zA-Z0-9_]{5,})$', 'Telegram username must be alphanumeric.')])
    is_approved = models.BooleanField(default=False)


class TherapistDocuments(models.Model):
    therapist = models.ForeignKey(Therapist, on_delete=models.CASCADE,
                                  related_name='documents')
    name = models.CharField(max_length=255)

    def get_path(self, filename: str):
        return f'therapist_documents/{self.therapist.user.username}/{filename}'

    document = models.FileField(upload_to=get_path)
