import logging
from django.db import IntegrityError
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
    try:
        logger.debug(request.data)
        roles = request.data['roles']

        invalid_roles = set(roles) - set(User.ALLOWED_ROLES)
        if invalid_roles:
            return Response(f"Invalide role(s): {', '.join(invalid_roles)}", status=status.HTTP_400_BAD_REQUEST)

        user: User = User.objects.create_user(
            username=request.data['username'],
            email=request.data['email'],
        )
        user.roles = roles  # set roles after the user is saved
        user.set_password(request.data['password'])

        if "CREATOR" in roles:
            user.is_active = False
            user.save()
            return Response({
                'message': "Your account has been created but is not yet activated. "
                           "Please wait for the administration to review your request."
            })

        user.save()
        token = Token.objects.create(user=user)
        serializer = UserSerializer(user)
        return Response({'token': token.key, 'user': serializer.data})
    except IntegrityError as e:
        logger.debug(e)
        return Response("Username and/or email already taken", status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.debug(e)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def login(request):
    try:
        user = User.objects.filter(email=request.data['email']).first()
        if not (user and user.check_password(request.data['password'])):
            return Response("Incorrect Credentials", status=status.HTTP_400_BAD_REQUEST)
        if not user.is_active:
            return Response("Your account is not active", status=status.HTTP_400_BAD_REQUEST)
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(user)
        return Response({'token': token.key, 'user': serializer.data})
    except Exception as e:
        logger.debug(e, exc_info=True)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_password(request):
    try:
        user = request.user
        current_password = request.data["currentPassword"]
        new_password = request.data["newPassword"]
        if not user.check_password(current_password):
            return Response("Incorrect Credentials", status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        return Response("Password is updated", status=status.HTTP_200_OK)
    except Exception as e:
        logger.debug(e)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_avatar(request):
    try:
        if request.FILES.get('avatar'):
            user = request.user
            user.avatar = request.FILES['avatar']
            user.save()
            logger.debug(user.avatar.url)
            return Response(user.avatar.url, status=status.HTTP_200_OK)
        return Response("No image provided", status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.debug(e)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def logout(request):
    try:
        Token.objects.filter(user=request.user).delete()
        return Response({"message": "Successfully logged out"})
    except Exception as e:
        logger.debug(e)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_authenticated_user(request):
    try:
        user: User = request.user
        serializer = UserSerializer(user)
        return Response({'user': serializer.data})
    except Exception as e:
        logger.debug(e)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
