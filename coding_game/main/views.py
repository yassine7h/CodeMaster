import logging

from django.http import HttpResponse
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from subprocess import run
from rest_framework.decorators import api_view
import ast

logger = logging.getLogger(__name__)


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all().order_by('name')
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['POST'])
def submit(request):
    args_list = ["1 2", "1000 100", "0 99"]
    results = ["3", "1100", "99"]
    logger.debug(args_list)
    code = request.data["code"]
    # command = ["python", "-c", request.data["code"]]
    command = ["docker", "run", "--rm", "exec_code", code, ";".join(args_list)]
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


def home(request):
    print(request.readlines())
    return HttpResponse("Hello, world. You're at the polls index.")
