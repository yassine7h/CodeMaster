import logging

from django.apps import AppConfig
from main.docker_utils import build_image
from subprocess import run
import os

logger = logging.getLogger(__name__)


class ExecutorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'executor'

    def ready(self):
        python_docker_path = os.path.join(os.path.dirname(__file__), 'python')
        build_image("executor_python", python_docker_path)
        java_docker_path = os.path.join(os.path.dirname(__file__), 'java')
        build_image("executor_java", java_docker_path)
