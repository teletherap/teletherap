from django.urls import re_path

from . import views


urlpatterns = [
    re_path(r'^therapist/$', views.PublicTherapistRL.as_view({
        'get': 'list',
    }), name='therapist'),
    re_path(r'^therapist/(?P<pk>.+)/$', views.PublicTherapistRL.as_view({
        'get': 'retrieve',
    }), name='therapist-detail'),
]
