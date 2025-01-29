import logging

from django.apps import AppConfig
from main.docker_utils import build_image
import os

logger = logging.getLogger(__name__)


class TestCaseRunnerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'test_cases_runner'

    def ready(self):
        python_docker_path = os.path.join(os.path.dirname(__file__), 'python')
        build_image("test_cases_runner_python", python_docker_path)
        java_docker_path = os.path.join(os.path.dirname(__file__), 'java')
        build_image("test_cases_runner_java", java_docker_path)
