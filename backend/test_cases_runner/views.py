import logging
from rest_framework import status
from rest_framework.response import Response
from subprocess import run, CalledProcessError
from rest_framework.decorators import api_view
import ast

logger = logging.getLogger(__name__)

@api_view(['POST'])
def run_test_cases_python(request):
    try:
        tests_res = run_test_cases(
            container_name="test_cases_runner_python",
            code=request.data["code"],
            tests=["1 2", "1000 100", "0 99"],
            expected_results=["3", "1100", "99"]
        )
        return Response(tests_res, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def run_test_cases_java(request):
    try:
        tests_res = run_test_cases(
            container_name="test_cases_runner_java",
            code=request.data["code"],
            tests=["1 2", "1000 100", "0 99"],
            expected_results=["3", "1100", "99"]
        )
        return Response(tests_res, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def run_test_cases(container_name, code, tests, expected_results):
    command = ["docker", "run", "--rm",  container_name, code, ";".join(tests)]
    command_output = run(command, check=True, capture_output=True, text=True)
    formatted_command_output = ast.literal_eval(command_output.stdout)
    test_results = formatted_command_output['test_results']
    logger.debug(formatted_command_output)
    tests_res = []
    for i in range(len(tests)):
        tests_res.append({
            "input": tests[i],
            "expected_output": expected_results[i],
            "actual_output": test_results[i]['output'],
            "status": test_results[i]['output'] == expected_results[i]
        })
    return tests_res
