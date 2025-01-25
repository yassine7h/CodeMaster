#!/usr/bin/env python3
import sys
import json
import subprocess
from typing import Dict, Any
import tempfile
import os


def run_code(code: str, test_cases: str) -> Dict[str, Any]:
    # Create a temporary file for the code
    with tempfile.NamedTemporaryFile(suffix='.py', mode='w', delete=False) as f:
        f.write(code)
        temp_file = f.name

    results = []
    tests = test_cases.split(';')

    for i, test in enumerate(tests, 1):
        try:
            # Run the code with timeout
            proc = subprocess.run(
                ['python', temp_file],
                input=test.replace(' ', '\n'),
                text=True,
                capture_output=True,
                timeout=10
            )
            status = 'success' if proc.returncode == 0 else 'runtime_error'

            results.append({
                'test_number': str(i),
                'input': test,
                'status': status,
                'output': proc.stdout.strip(),
                'error': proc.stderr
            })
        except subprocess.TimeoutExpired:
            results.append({
                'test_number': str(i),
                'input': test,
                'status': 'timeout',
                'output': '',
                'error': 'Execution timed out'
            })
        except Exception as e:
            results.append({
                'test_number': str(i),
                'input': test,
                'status': 'runtime_error',
                'output': '',
                'error': str(e)
            })

    os.unlink(temp_file)

    return {
        'status': 'completed',
        'total_tests': str(len(tests)),
        'test_results': results
    }


if __name__ == '__main__':
    if len(sys.argv) < 3:
        print(json.dumps({
            'status': 'error',
            'error': 'Missing code or test cases',
            'test_results': []
        }))
        sys.exit(1)

    code = sys.argv[1]
    test_cases = sys.argv[2]
    result = run_code(code, test_cases)
    print(json.dumps(result))
