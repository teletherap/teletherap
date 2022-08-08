from django.contrib import admin

from .models import Wallet, Deposit, Withdrawal, ReservationTransaction


# Register your models here.
admin.site.register(Wallet)
admin.site.register(Deposit)
admin.site.register(Withdrawal)
admin.site.register(ReservationTransaction)
