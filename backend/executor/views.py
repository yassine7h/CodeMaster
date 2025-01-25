import logging
from rest_framework import status
from rest_framework.response import Response
from subprocess import run, CalledProcessError
from rest_framework.decorators import api_view
import ast

logger = logging.getLogger(__name__)


@api_view(['POST'])
def run_python_code(request):
    try:
        tests_res = run_code(
            container_name="executor_python",
            code=request.data["code"],
        )
        return Response(tests_res, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def run_java_code(request):
    try:
        tests_res = run_code(
            container_name="executor_java",
            code=request.data["code"],
        )
        return Response(tests_res, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def run_code(container_name, code):
    command = ["docker", "run", "--rm", container_name, code]
    command_output = run(command, check=True, capture_output=True, text=True)
    formatted_command_output = ast.literal_eval(command_output.stdout)
    return formatted_command_output
