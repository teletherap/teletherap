from django.db import models
from django.core.validators import RegexValidator

from therapy import models as therapy_models


# Create your models here.
class Client(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,
                                related_name='client',
                                primary_key=True)

    def __str__(self):
        return str(self.user)

class Therapist(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,
                                related_name='therapist',
                                primary_key=True)
    description = models.TextField(blank=True, null=True)
    license_id = models.CharField(max_length=10, null=True)
    expertise = models.CharField(max_length=100, null=True)
    years_of_experience = models.IntegerField(null=True)
    price_per_session = models.IntegerField(null=True)
    daily_start_time = models.TimeField(null=True)
    daily_end_time = models.TimeField(null=True)
    telegram_username = models.CharField(max_length=255, null=True, validators=[
                                         RegexValidator(r'^([a-zA-Z0-9_]{5,})$', 'Telegram username must be alphanumeric.')])
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return str(self.user)

    @property
    def upcoming_reservations(self) -> models.QuerySet[therapy_models.Reservation]:
        return self.reservations.filter(state=therapy_models.Reservation.State.RESERVED)


class TherapistDocuments(models.Model):
    name = models.CharField(max_length=255, primary_key=True)
    therapist = models.ForeignKey(Therapist, on_delete=models.CASCADE,
                                  related_name='documents')

    def get_path(self, filename: str):
        return f'therapist_documents/{self.therapist.user.username}/{filename}'

    document = models.FileField(upload_to=get_path)


class AccountActivation(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,
                                related_name='account_activation')
    activation_key = models.CharField(max_length=40)

    def __str__(self):
        return str(self.user)
