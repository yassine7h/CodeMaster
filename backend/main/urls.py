from django.urls import path
from . import views

urlpatterns = [
    path("problems", views.create_problem),
]
