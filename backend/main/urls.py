from django.urls import path
from . import views

urlpatterns = [
    path("auth/signup", views.signup),
    path("auth/signin", views.login),
    path("auth/logout", views.logout),
    path("auth/update-password", views.update_password),
    path("users/me", views.get_authenticated_user),
    path("users/update-avatar", views.update_avatar),
]
