from django.urls import path
from . import views

urlpatterns = [
    path("me", views.get_authenticated_user),
    path("signup", views.signup),
    path("signin", views.login),
    path("logout", views.logout),
    path("update-password", views.update_password),
    path("update-avatar", views.update_avatar),
]
