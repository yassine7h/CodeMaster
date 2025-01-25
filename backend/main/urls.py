from django.urls import path
from . import views

urlpatterns = [
    path("auth/signup", views.signup),
    path("auth/signin", views.login),
    path("auth/logout",views.logout),
    path("test_token", views.test_token),
    path("users/me", views.get_authenticated_user),
]
