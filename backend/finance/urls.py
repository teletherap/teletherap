from django.urls import re_path

from . import views


urlpatterns = [
    re_path(r'^withdraw/$', views.Withdraw.as_view(), name='withdraw'),
]
