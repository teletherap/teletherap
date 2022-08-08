from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator

# Create your models here.
class Reservation(models.Model):
    client = models.ForeignKey('user.Client', on_delete=models.CASCADE,
                               related_name='reservations')
    therapist = models.ForeignKey('user.Therapist', on_delete=models.CASCADE,
                                  related_name='reservations')
    datetime = models.DateTimeField()

    class CommunicationType(models.TextChoices):
        TELEGRAM = 'tlgrm', _('Telegram')
        GOOGLE_MEET = 'gmeet', _('Google Meet')

    communication_type = models.CharField(max_length=5, choices=CommunicationType.choices,
                                          default=CommunicationType.TELEGRAM)
                                        
class Review(models.Model):
    reservation = models.OneToOneField('therapy.Reservation', on_delete=models.CASCADE,
                                       related_name='review')
    rating = models.IntegerField(null=True,
                                 validators=[
                                    MinValueValidator(1),
                                    MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    