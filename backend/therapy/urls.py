from django.urls import re_path

from . import views


urlpatterns = [
    re_path(r'^therapist/$', views.PublicTherapistRL.as_view({
        'get': 'list',
    }), name='therapist'),
    re_path(r'^therapist/(?P<pk>\d+)/$', views.PublicTherapistRL.as_view({
        'get': 'retrieve',
    }), name='therapist-detail'),
    re_path(r'^therapist/reservation/$', views.TherapistReservation.as_view({
        'get': 'list',
    }), name='therapist-reservation'),
    re_path(r'^therapist/reservation/(?P<pk>\d+)/$', views.TherapistReservation.as_view({
        'get': 'retrieve',
        'delete': 'destroy',
    }), name='therapist-reservation-detail'),
    re_path(r'^therapist/reservation/(?P<pk>\d+)/attend/$', views.TherapistReservationAttend.as_view({
        'get': 'retrieve',
    }), name='therapist-reservation-attend'),
    re_path(r'^client/reservation/$', views.ClientReservation.as_view({
        'post': 'create',
        'get': 'list',
    }), name='client-reservation'),
    re_path(r'^client/reservation/(?P<pk>\d+)/$', views.ClientReservation.as_view({
        'get': 'retrieve',
        'delete': 'destroy',
    }), name='client-reservation-detail'),
    re_path(r'^client/reservation/(?P<pk>\d+)/attend/$', views.ClientReservationAttend.as_view({
        'get': 'retrieve',
    }), name='client-reservation-attend'),
    re_path(r'^review/$', views.ReviewViewSet.as_view({
        'post': 'create',
    }), name='review'),
    re_path(r'^review/(?P<pk>\d+)/$', views.ReviewViewSet.as_view({
        'patch': 'partial_update',
    }), name='review-detail'),
]
