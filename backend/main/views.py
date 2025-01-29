import logging
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics

from .models import Problem, ProblemCategory, TestCase
from .permissions import IsAuthorOrReadOnly, IsAnyAuthorOrReadOnly
from .serializers import ProblemSerializer, ProblemCategroySerializer, TestCaseSerializer

logger = logging.getLogger(__name__)


class TestCaseListCreate(generics.ListCreateAPIView):
    serializer_class = TestCaseSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    pagination_class = None

    def get_queryset(self):
        problem_id = self.kwargs.get('problem_id')
        return TestCase.objects.filter(problem_id=problem_id)

    def perform_create(self, serializer):
        problem_id = self.kwargs.get('problem_id')
        serializer.save(problem_id=problem_id)


class TestCaseGetUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TestCaseSerializer
    permission_classes = [IsAuthenticated]  # TODO protect against not authorized users trying to update/delete
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        problem_id = self.kwargs.get('problem_id')
        return TestCase.objects.filter(problem_id=problem_id)

    def perform_update(self, serializer):
        problem_id = self.kwargs.get('problem_id')
        serializer.save(problem_id=problem_id)


class ProblemCategoryList(generics.ListAPIView):
    queryset = ProblemCategory.objects.all()
    serializer_class = ProblemCategroySerializer
    permission_classes = [IsAuthenticated, IsAnyAuthorOrReadOnly]
    authentication_classes = [TokenAuthentication]
    pagination_class = None


class ProblemList(generics.ListAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    pagination_class = None


class ProblemGet(generics.RetrieveAPIView):
    queryset = Problem.objects.all()
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    pagination_class = None


class AuthorProblemListCreate(generics.ListCreateAPIView):
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    authentication_classes = [TokenAuthentication]
    pagination_class = None

    def get_queryset(self):
        return Problem.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class AuthorProblemGetUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProblemSerializer
    permission_classes = [IsAuthenticated, IsAuthorOrReadOnly]
    authentication_classes = [TokenAuthentication]

    def get_queryset(self):
        return Problem.objects.filter(author=self.request.user)
