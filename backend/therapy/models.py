from datetime import timedelta
from uuid import uuid4

from django.db import models
from django.utils.translation import gettext_lazy as _
from django.core.validators import MinValueValidator, MaxValueValidator
from django.utils import timezone

# Create your models here.
class Reservation(models.Model):
    client = models.ForeignKey('user.Client', on_delete=models.CASCADE,
                               related_name='reservations')
    therapist = models.ForeignKey('user.Therapist', on_delete=models.CASCADE,
                                  related_name='reservations')
    datetime = models.DateTimeField()
    uuid = models.UUIDField(default=uuid4, editable=False)

    class CommunicationType(models.TextChoices):
        TELEGRAM = 'tlgrm', _('Telegram')
        VIDEO = 'video', _('Video')

    communication_type = models.CharField(max_length=5, choices=CommunicationType.choices,
                                          default=CommunicationType.TELEGRAM)
                                        
    class State(models.TextChoices):
        RESERVED = 'resd', _('Reserved')
        ONGOING = 'ongo', _('Ongoing')
        ATTENDED = 'attd', _('Attended')
        CANCELLED = 'cnl', _('Cancelled')

    state = models.CharField(max_length=4, choices=State.choices, default=State.RESERVED)

    @property
    def current_state(self) -> str:
        if self.state in (self.State.RESERVED, self.State.ONGOING) and timezone.now() > self.datetime:
            if timezone.now() > self.datetime + timedelta(hours=1):
                self.state = self.State.ATTENDED
                self.save()
            else:
                self.state = self.State.ONGOING
                self.save()
        return self.state

    @property
    def url_for_client(self) -> str:
        return f'https://meet.jit.si/teletherap-{uuid4()}' \
            if self.communication_type == self.CommunicationType.VIDEO else \
            f'https://telegram.me/{self.therapist.telegram_username}'

    @property
    def url_for_therapist(self) -> str:
        return f'https://meet.jit.si/teletherap-{uuid4()}' \
            if self.communication_type == self.CommunicationType.VIDEO else \
            f'https://telegram.me/{self.client.telegram_username}'


class Review(models.Model):
    reservation = models.OneToOneField('therapy.Reservation', on_delete=models.CASCADE,
                                       related_name='review')
    rating = models.IntegerField(null=True,
                                 validators=[
                                    MinValueValidator(1),
                                    MaxValueValidator(5)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    