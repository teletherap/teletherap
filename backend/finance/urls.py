from django.urls import re_path

from . import views


urlpatterns = [
    re_path(r'^withdraw/$', views.Withdraw.as_view(), name='withdraw'),
    re_path(r'^deposit/request/$', views.RequestDeposit.as_view(), name='request_deposit'),
    re_path(r'^deposit/verify/(?P<username>.+)/(?P<amount>.+)/$', views.VerifyDeposit.as_view(), name='verify_deposit'),
]
