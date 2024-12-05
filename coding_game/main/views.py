from django.http import HttpResponse
from django.contrib.auth.models import Group, User
from rest_framework import permissions, viewsets, status
from rest_framework.response import Response
from tutorial.quickstart.serializers import GroupSerializer, UserSerializer
from subprocess import run, CalledProcessError
from rest_framework.decorators import api_view


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
    args = "1 2\n3 4"
    code = request.data["code"]
    # command = ["python", "-c", request.data["code"]]
    command = ["docker", "run", "--rm", "exec_code", code, args]
    res = dict()
    try:
        output = run(command, input=args, check=True, capture_output=True, text=True)
        res["stdout"] = output.stdout
    except CalledProcessError as e:
        res["stderr"] = e.stderr
    return Response(res, status=status.HTTP_200_OK)


def home(request):
    print(request.readlines())
    return HttpResponse("Hello, world. You're at the polls index.")
