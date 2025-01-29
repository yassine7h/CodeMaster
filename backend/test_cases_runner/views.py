import logging
from rest_framework import status
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from subprocess import run, CalledProcessError
from rest_framework.decorators import api_view, authentication_classes, permission_classes
import ast

from main.models import TestCase

logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def run_test_cases_python(request):
    try:
        test_cases = TestCase.objects.filter(problem_id=request.data["problemId"])
        tests_inputs = []
        expected_results = []
        for test_case in test_cases:
            tests_inputs.append(test_case.arguments)
            expected_results.append(test_case.expected_output)
        tests_res = run_test_cases(
            container_name="test_cases_runner_python",
            code=request.data["code"],
            tests_inputs=tests_inputs,
            expected_results=expected_results
        )
        return Response(tests_res, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def run_test_cases_java(request):
    try:
        test_cases = TestCase.objects.filter(problem_id=request.data["problemId"])
        tests_inputs = []
        expected_results = []
        for test_case in test_cases:
            tests_inputs.append(test_case.arguments)
            expected_results.append(test_case.expected_output)
        tests_res = run_test_cases(
            container_name="test_cases_runner_java",
            code=request.data["code"],
            tests_inputs=tests_inputs,
            expected_results=expected_results
        )
        return Response(tests_res, status=status.HTTP_200_OK)
    except CalledProcessError as e:
        logger.error(e.stderr)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def run_test_cases(container_name, code, tests_inputs, expected_results):
    command = ["docker", "run", "--rm", container_name, code, ";".join(tests_inputs)]
    command_output = run(command, check=True, capture_output=True, text=True)
    formatted_command_output = ast.literal_eval(command_output.stdout)
    test_results = formatted_command_output['test_results']
    logger.debug(formatted_command_output)
    tests_res = []
    for i in range(len(tests_inputs)):
        tests_res.append({
            "input": tests_inputs[i],
            "expected_output": expected_results[i],
            "actual_output": test_results[i]['output'],
            "status": test_results[i]['output'] == expected_results[i]
        })
    return tests_res
