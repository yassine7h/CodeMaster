from django.db import models


class Problem(models.Model):
    description = models.TextField()
    example = models.TextField()
    function_description = models.TextField()
    input_format = models.TextField()
    output_format = models.TextField()
    sample_input = models.TextField()
    sample_output = models.TextField()
    explanation = models.TextField()
    difficulty = models.CharField(max_length=9,
                                  choices={0: "easy", 1: "medium", 2: "hard"},
                                  default=0)


class TestCase(models.Model):
    arguments = models.TextField()
    output = models.TextField()
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE)

