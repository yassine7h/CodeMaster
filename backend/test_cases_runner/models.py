from django.contrib.auth.models import User
from django.db import models
from django.db.models.functions import Now
from .validators import *


class Problem(models.Model):
    name = models.CharField()
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
