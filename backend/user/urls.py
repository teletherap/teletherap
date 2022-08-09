from django.conf import settings
from django.urls import re_path
from django.views.decorators.http import require_http_methods, require_POST
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


urlpatterns = [
    re_path(r'^login/$', views.MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    re_path(r'^login/refresh/$', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^register/client/$', views.ClientRegisterView.as_view(), name='register_client'),
    re_path(r'^register/therapist/$', views.TherapistRegisterView.as_view(), name='register_therapist'),
    re_path(r'^therapist/$', views.PrivateTherapistRU.as_view(), name='therapist'),
    re_path(r'^therapist/documents/$', require_POST(views.TherapistDocumentCD.as_view()), name='therapist_documents'),
    re_path(r'^therapist/documents/(?P<pk>.+)/$', require_http_methods(['DELETE'])(views.TherapistDocumentCD.as_view()), name='therapist_document'),
    re_path(rf'^{settings.VERIFICATION_PATH}/(?P<username>.+)/(?P<token>.+)/$', views.AccountVerification.as_view(), name='account_verification'),
]
