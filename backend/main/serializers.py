from rest_framework import serializers

from .models import Problem, ProblemCategory, TestCase


class ProblemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Problem
        fields = (['id', 'name', 'description', 'example', 'function_description', 'input_format', 'output_format'] +
                  ['sample_input', 'sample_output', 'explanation', 'difficulty', 'category', 'author'])
        read_only_fields = ['author']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['category'] = {
            'id': instance.category.id,
            'name': instance.category.name
        }
        return representation


class ProblemCategroySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemCategory
        fields = (['id', 'name'])


class TestCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCase
        fields = (['id', 'arguments', 'expected_output', 'problem'])
        read_only_fields = ['problem']