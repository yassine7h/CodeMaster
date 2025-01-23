from django.urls import path
from . import views

urlpatterns = [
    path("python", views.run_test_cases_python),
    path("java", views.run_test_cases_java),
]
