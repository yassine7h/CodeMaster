import logging
from rest_framework import status
from rest_framework.response import Response
from subprocess import run, CalledProcessError
from rest_framework.decorators import api_view
from main.docker_utils import launch_container
import ast

logger = logging.getLogger(__name__)


@api_view(['POST'])
def run_python_code(request):
    try:
        out = launch_container("executor_python", [request.data["code"]], rm=True)
        formatted_out = ast.literal_eval(out.stdout)
        return Response(formatted_out, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def run_java_code(request):
    try:
        out = launch_container("executor_java", [request.data["code"]], rm=True)
        formatted_out = ast.literal_eval(out.stdout)
        return Response(formatted_out, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


