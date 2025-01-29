from django.urls import path
from . import views

urlpatterns = [
    path('problems/', views.ProblemList.as_view()),
    path('problems/<int:pk>/', views.ProblemGet.as_view()),
    path('creator/problems/', views.AuthorProblemListCreate.as_view()),
    path('creator/problems/<int:pk>/', views.AuthorProblemGetUpdateDelete.as_view()),
    path('problems/categories/', views.ProblemCategoryList.as_view()),
    path('problems/<int:problem_id>/testcases/', views.TestCaseListCreate.as_view()),
    path('problems/<int:problem_id>/testcases/<int:pk>/', views.TestCaseGetUpdateDelete.as_view()),
]
