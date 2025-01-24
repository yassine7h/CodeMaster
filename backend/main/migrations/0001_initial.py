# Generated by Django 5.1.3 on 2025-01-07 09:39

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Problem",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("description", models.TextField()),
                ("example", models.TextField()),
                ("function_description", models.TextField()),
                ("input_format", models.TextField()),
                ("output_format", models.TextField()),
                ("sample_input", models.TextField()),
                ("sample_output", models.TextField()),
                ("explanation", models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name="TestCase",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("arguments", models.TextField()),
                ("output", models.TextField()),
                (
                    "problem",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="main.problem"
                    ),
                ),
            ],
        ),
    ]