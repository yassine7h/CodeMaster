import logging

from django.apps import AppConfig
from subprocess import run
import os

logger = logging.getLogger(__name__)


class ExecutorConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'executor'

    def ready(self):
        python_docker_path = os.path.join(os.path.dirname(__file__), 'python')
        python_docker_image_build_command = [
            "docker",
            "build",
            "-t",
            "executor_python",
            "-f",
            os.path.join(python_docker_path, "Dockerfile"),
            python_docker_path
        ]
        java_docker_path = os.path.join(os.path.dirname(__file__), 'java')
        java_docker_image_build_command = [
            "docker",
            "build",
            "-t",
            "executor_java",
            "-f",
            os.path.join(java_docker_path, "Dockerfile"),
            java_docker_path
        ]
        try:
            result = run(python_docker_image_build_command, check=True, capture_output=True, text=True)
            logger.info("Docker Image for python executor build successful " + result.stdout)
            result = run(java_docker_image_build_command, check=True, capture_output=True, text=True)
            logger.info("Docker Image for java executor build successful " + result.stdout)
        except Exception as e:
            logger.error("Docker build failed:" + str(e))
