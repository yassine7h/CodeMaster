import json
import logging

from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework.authtoken.models import Token

from .models import User
from .serializers import UserSerializer

logger = logging.getLogger(__name__)


@api_view(['POST'])
def signup(request):
    logger.debug(request.data)
    user: User = User.objects.create_user(
        username=request.data['username'],
        email=request.data['email'],
        roles=json.dumps(request.data['roles'])  # TODO check roles before assingin them
    )
    user.set_password(request.data['password'])
    user.save()
    token = Token.objects.create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})


@api_view(['POST'])
def login(request):
    user = User.objects.filter(email=request.data['email']).first()
    if not (user and user.check_password(request.data['password'])):
        return Response("Incorrect Credentials", status=status.HTTP_400_BAD_REQUEST)
    token, created = Token.objects.get_or_create(user=user)
    serializer = UserSerializer(user)
    return Response({'token': token.key, 'user': serializer.data})
@api_view(['POST'])
def logout(request):
    Token.objects.filter(user=request.user).delete()
    return Response({"message": "Successfully logged out"})

@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
    return Response("passed!")


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_authenticated_user(request):
    user = request.user
    serializer = UserSerializer(user)
    return Response({'user': serializer.data})
