import logging

from django.apps import AppConfig
from subprocess import run
import os

logger = logging.getLogger(__name__)


class TestCaseRunnerConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'test_cases_runner'

    def ready(self):
        python_docker_path = os.path.join(os.path.dirname(__file__), 'python')
        python_docker_image_build_command = [
            "docker",
            "build",
            "-t",
            "test_cases_runner_python",
            "-f",
            os.path.join(python_docker_path, "Dockerfile"),
            python_docker_path
        ]
        try:
            result = run(python_docker_image_build_command, check=True, capture_output=True, text=True)
            logger.info("Docker build successful " + result.stdout)
        except Exception as e:
            logger.error("Docker build failed:" + str(e))
