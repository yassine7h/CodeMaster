import logging
from rest_framework import status
from rest_framework.response import Response
from subprocess import run
from rest_framework.decorators import api_view
import ast

logger = logging.getLogger(__name__)

@api_view(['POST'])
def run_test_cases_python(request):
    args_list = ["1 2", "1000 100", "0 99"]
    results = ["3", "1100", "99"]
    logger.debug(args_list)
    code = request.data["code"]
    command = ["docker", "run", "--rm", "test_cases_runner_python", code, ";".join(args_list)]
    output = run(command, check=True, capture_output=True, text=True)
    res = ast.literal_eval(output.stdout.strip())
    tests_res = []
    c = True
    logger.debug(len(args_list))
    for i in range(len(args_list)):
        final_out = res[i]["error"] if res[i]["error"] else res[i]["output"]
        tests_res.append({
            "input": args_list[i],
            "expected_output": results[i],
            "actual_output": final_out,
            "status": final_out == results[i]
        })
        if final_out != results[i]:
            c = False
    res = {
        "stdout": c,
        "stderr": c,
        "tests": tests_res
    }
    logger.debug(msg=res)
    return Response(res, status=status.HTTP_200_OK)


@api_view(['POST'])
def run_test_cases_java(request):
    args_list = ["1 2", "1000 100", "0 99"]
    expected_results = ["3", "1100", "99"]
    logger.debug(args_list)
    code = request.data["code"]
    command = ["docker", "run", "-rm", "test_cases_runner_java", code, ";".join(args_list)]
    command_output = run(command, check=True, capture_output=True, text=True)
    formatted_command_output = ast.literal_eval(command_output.stdout)
    test_results = formatted_command_output['test_results']
    tests_res = []
    for i in range(len(args_list)):
        tests_res.append({
            "input": args_list[i],
            "expected_output": expected_results[i],
            "actual_output": test_results[i]['output'],
            "status": test_results[i]['output'] == expected_results[i]
        })
    res = {
        "stdout": True,
        "stderr": True,
        "tests": tests_res
    }
    logger.debug(msg=res)
    return Response(res, status=status.HTTP_200_OK)
