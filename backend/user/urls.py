from django.urls import re_path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views


urlpatterns = [
    re_path(r'^login/$', views.MyObtainTokenPairView.as_view(), name='token_obtain_pair'),
    re_path(r'^login/refresh/$', TokenRefreshView.as_view(), name='token_refresh'),
    re_path(r'^register/client/$', views.ClientRegisterView.as_view(), name='register_client'),
]
