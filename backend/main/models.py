import json

from django.db import models
from django.contrib.auth.models import AbstractUser, Group
from django.db.models.functions import Now
from .validators import *


class User(AbstractUser):
    # Optional: Add a direct role field
    ROLES = ('ADMIN', 'CREATOR', 'LEARNER')
    roles = models.JSONField(default=list)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Map JSON roles to groups
        current_groups = set(self.groups.values_list('name', flat=True))
        new_groups = set(json.loads(self.roles.__str__()))
        # Remove old groups
        groups_to_remove = current_groups - new_groups
        if groups_to_remove:
            remove_groups = Group.objects.filter(name__in=groups_to_remove)
            self.groups.remove(*remove_groups)
        # Add new groups
        groups_to_add = new_groups - current_groups
        if groups_to_add:
            add_groups = Group.objects.filter(name__in=groups_to_add)
            self.groups.add(*add_groups)


class Problem(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    example = models.TextField()
    function_description = models.TextField()
    input_format = models.TextField()
    output_format = models.TextField()
    sample_input = models.TextField()
    sample_output = models.TextField()
    explanation = models.TextField()
    difficulty = models.CharField(max_length=9,
                                  choices={"easy": "easy", "medium": "medium", "hard": "hard"},
                                  default="medium")
    author = models.ForeignKey(User, on_delete=models.CASCADE, validators=[validate_problem_user_admin])


class TestCase(models.Model):
    arguments = models.TextField()
    expected_output = models.TextField()
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)


class Submission(models.Model):
    datetime = models.DateTimeField(db_default=Now())
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    output = models.JSONField()
