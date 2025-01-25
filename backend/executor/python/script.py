#!/usr/bin/env python3
import sys
import json
import subprocess
import tempfile
import os

def run_code(code: str) -> dict:
    with tempfile.NamedTemporaryFile(suffix='.py', mode='w', delete=False) as f:
        f.write(code)
        temp_file = f.name

    try:
        proc = subprocess.run(
            ['python', temp_file],
            text=True,
            capture_output=True,
            timeout=10
        )
        result = {
            'stdout': proc.stdout,
            'stderr': proc.stderr,
            'status_code': proc.returncode
        }
    except subprocess.TimeoutExpired:
        result = {
            'stdout': '',
            'stderr': 'Execution timed out',
            'status_code': 124
        }
    except Exception as e:
        result = {
            'stdout': '',
            'stderr': str(e),
            'status_code': 1
        }

    os.unlink(temp_file)
    return result

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({
            'stdout': '',
            'stderr': 'No code provided',
            'status_code': 1
        }))
        sys.exit(1)

    code = sys.argv[1]
    result = run_code(code)
    print(json.dumps(result))