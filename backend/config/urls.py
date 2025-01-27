from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

from django.conf import settings

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("accounts.urls")),
    path("executor/", include("executor.urls")),
    path("run_test_cases/", include("test_cases_runner.urls")),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
