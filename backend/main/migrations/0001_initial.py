# Generated by Django 5.0.2 on 2025-01-26 23:49

import django.db.models.deletion
import django.db.models.functions.datetime
import main.validators
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Problem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('example', models.TextField()),
                ('function_description', models.TextField()),
                ('input_format', models.TextField()),
                ('output_format', models.TextField()),
                ('sample_input', models.TextField()),
                ('sample_output', models.TextField()),
                ('explanation', models.TextField()),
                ('difficulty', models.CharField(choices=[('easy', 'easy'), ('medium', 'medium'), ('hard', 'hard')], default='medium', max_length=9)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, validators=[main.validators.validate_problem_user_admin])),
            ],
        ),
        migrations.CreateModel(
            name='Submission',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('datetime', models.DateTimeField(db_default=django.db.models.functions.datetime.Now())),
                ('output', models.JSONField()),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.problem')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TestCase',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('arguments', models.TextField()),
                ('expected_output', models.TextField()),
                ('problem', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='main.problem')),
            ],
        ),
    ]
