from django.urls import path
from . import views

urlpatterns = [
    path("python", views.run_python_code),
    path("java", views.run_java_code),
]
