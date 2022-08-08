from re import A
from django.contrib import admin

from .models import Reservation, Review


# Register your models here.
admin.site.register(Reservation)
admin.site.register(Review)
