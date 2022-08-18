from django.db import models
from django.core.validators import RegexValidator

# Create your models here.
class Wallet(models.Model):
    user = models.OneToOneField('auth.User', on_delete=models.CASCADE,
                                 related_name='wallet',
                                 primary_key=True)
    balance = models.FloatField(default=0)

    def __str__(self):
        return f'{self.user}\'s balance: {self.balance}'


class Deposit(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE,
                                 related_name='payment')
    amount = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)
    ref_id = models.CharField(max_length=255, null=True)
    
    def __str__(self):
        return f'{self.user}\'s deposit: {self.amount} at {self.date}'

class Withdrawal(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE,
                                 related_name='withdrawal')
    amount = models.FloatField()
    date = models.DateTimeField(auto_now_add=True)
    destination_iban = models.CharField(max_length=255, null=True,
                            validators=[RegexValidator(r'^([a-zA-Z0-9]{26})$', 'IBAN is not correct.')])

    def __str__(self):
        return f'{self.user}\'s withdrawal: {self.amount} at {self.date}'


class ReservationTransaction(models.Model):
    reservation = models.OneToOneField('therapy.Reservation', on_delete=models.CASCADE,
                                       related_name='transaction')
    amount = models.FloatField()
    is_rollbacked = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.reservation}\'s transaction: {self.amount}'
