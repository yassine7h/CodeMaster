import os
from subprocess import run, CalledProcessError
import logging

logger = logging.getLogger(__name__)


def docker_image_exists(image_name, tag="latest"):
    try:
        result = run(
            ["docker", "images", "-q", f"{image_name}:{tag}"],
            capture_output=True, text=True, check=True
        )
        return result.stdout.strip()
    except CalledProcessError as e:
        logger.error("Docker command failed: " + str(e))
        return False


def build_image(image_name, path):
    image_id = docker_image_exists(image_name)
    if image_id:
        logger.info(f"Using existant {image_name} image of id: {image_id}")
        return
    python_docker_image_build_command = [
        "docker",
        "build",
        "-t",
        image_name,
        "-f",
        os.path.join(path, "Dockerfile"),
        path
    ]
    try:
        result = run(python_docker_image_build_command, check=True, capture_output=True, text=True)
        logger.info("Docker Image for python executor build successful " + result.stdout)
    except Exception as e:
        logger.error("Docker build failed: " + str(e))


def launch_container(image_name, params, rm=False):
    command = ["docker", "run", image_name] + [rm and "--rm"] + params
    command_output = run(command, check=True, capture_output=True, text=True)
    return command_output.stdout
