from django.urls import path
from .views import PythonView

urlpatterns = [
    path('python/', PythonView.as_view(), name='python'),
]
