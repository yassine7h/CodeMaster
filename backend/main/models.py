from django.db import models
from django.db.models.functions import Now
from .validators import *
from accounts.models import User


class ProblemCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


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
                                  choices={"Easy": "Easy", "Medium": "Medium", "Hard": "Hard"},
                                  default="medium")
    # code_template = models.JSONField(default=dict, null=True, blank=True)
    category = models.ForeignKey(ProblemCategory, on_delete=models.SET_NULL, null=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, validators=[validate_problem_user_admin])

    def __str__(self):
        return self.name


class TestCase(models.Model):
    arguments = models.TextField()
    expected_output = models.TextField()
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)


class Submission(models.Model):
    datetime = models.DateTimeField(db_default=Now())
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)
    output = models.JSONField()
