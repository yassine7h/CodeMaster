import logging

from django.http import HttpResponse
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from subprocess import run, CalledProcessError
from rest_framework.decorators import api_view


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
    args_list = [[1, 2], [1000, 100]]
    results = [3, 1100]
    args_list = "\n".join([" ".join(str(args)) for args in args_list])
    code = request.data["code"]
    # command = ["python", "-c", request.data["code"]]
    command = ["docker", "run", "--rm", "exec_code", code, args_list]
    res = dict()
    output = run(command, input=args_list, check=True, capture_output=True, text=True)
    res["stdout"] = output.stdout

    logger.debug(msg=res)
    return Response({
  "stdout": "Sample output",
  "stderr": "",
  "exit_code": 0,
  "tests": [
    {
      "input": "2 3",
      "expected_output": "5",
      "actual_output": "5",
      "status": "pass"
    },
    {
      "input": "4 5",
      "expected_output": "9",
      "actual_output": "10",
      "status": "fail"
    }
  ]
}, status=status.HTTP_200_OK)


def home(request):
    print(request.readlines())
    return HttpResponse("Hello, world. You're at the polls index.")
