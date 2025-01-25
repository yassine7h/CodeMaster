from django.contrib import admin
from django.urls import path, include


urlpatterns = [
    path("admin/", admin.site.urls),
    path("executor/", include("executor.urls")),
    path("run_test_cases/", include("test_cases_runner.urls")),
    path("", include("main.urls"))
]
