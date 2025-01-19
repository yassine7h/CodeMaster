from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CodeSerializer
import subprocess
import tempfile
import os
import time
import tracemalloc

class PythonView(APIView):
    def post(self, request):
        serializer = CodeSerializer(data=request.data)
        if serializer.is_valid():
            code = serializer.data.get('code') 
            with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_file:
                temp_file.write(code.encode('utf-8'))
                temp_file_path = temp_file.name
            try:
                # Start measuring performance
                tracemalloc.start()
                start_time = time.perf_counter()

                # Execute the Python script
                process = subprocess.Popen(
                    ['python', temp_file_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                stdout, stderr = process.communicate()

                # Stop measuring performance
                end_time = time.perf_counter()
                current, peak = tracemalloc.get_traced_memory()
                tracemalloc.stop()
                # Return results including performance metrics
                return Response({
                    'stdout': stdout,
                    'stderr': stderr,
                    'exit_code': process.returncode,
                    'performance': {
                        'execution_time': (end_time - start_time) * 1000,  # in ms
                        'memory_used': peak / 10**6  # in MB
                    }
                }, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            # print(serializer.data)
            # return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
