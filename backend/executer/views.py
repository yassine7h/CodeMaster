from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeSerializer
import subprocess
import tempfile
import os

class PythonView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.data.get('code') 
            with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_file:
                temp_file.write(code.encode('utf-8'))
                temp_file_path = temp_file.name
            try:
                # Execute the Python script
                process = subprocess.Popen(
                    ['python', temp_file_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                stdout, stderr = process.communicate()
                os.remove(temp_file_path)
                return Response({
                    'stdout': stdout,
                    'stderr': stderr,
                    'exit_code': process.returncode
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # print(serializer.data)
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
