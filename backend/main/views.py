import logging
from django.db import IntegrityError
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Problem

logger = logging.getLogger(__name__)


@api_view(['POST'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_problem(request):
    try:
        name = request.data['name']
        description = request.data['description']
        example = request.data['example']
        function_description = request.data['functionDescription']
        input_format = request.data['inputFormat']
        output_format = request.data['outputFormat']
        sample_input = request.data['sampleInput']
        sample_output = request.data['sampleOutput']
        explanation = request.data['explanation']
        difficulty = request.data['difficulty']
    except Exception as e:
        logger.debug(e)
        return Response("400_BAD_REQUEST", status=status.HTTP_400_BAD_REQUEST)

    try:
        author = request.user
        problem = Problem.objects.create(
            name=name,
            description=description,
            example=example,
            function_description=function_description,
            input_format=input_format,
            output_format=output_format,
            sample_input=sample_input,
            sample_output=sample_output,
            explanation=explanation,
            difficulty=difficulty,
            author=author
        )
        return Response({
            "message": "Problem created successfully",
            "id": problem.id
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        logger.debug(e)
        return Response("INTERNAL_SERVER_ERROR", status=status.HTTP_500_INTERNAL_SERVER_ERROR)
