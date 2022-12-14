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
    re_path(r'^therapist/review/$', views.TherapistReviewViewSet.as_view({
        'get': 'list',
    }), name='therapist-review'),
    re_path(r'^therapist/review/(?P<pk>\d+)/$', views.TherapistReviewViewSet.as_view({
        'get': 'retrieve',
    }), name='therapist-review-detail'),
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
    re_path(r'^client/review/$', views.ClientReviewViewSet.as_view({
        'post': 'create',
        'get': 'list',
    }), name='client-review'),
    re_path(r'^client/review/(?P<pk>\d+)/$', views.ClientReviewViewSet.as_view({
        'get': 'retrieve',
        'patch': 'partial_update',
    }), name='client-review-detail'),
]
