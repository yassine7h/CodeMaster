from django.contrib.auth.models import User
from django.core.exceptions import PermissionDenied


def validate_problem_user_admin(value):
    if not User.objects.get(pk=value).groups.filter(name='admin').exists():
        raise PermissionDenied("Only admin can create new problems")