#!/bin/bash

echo "$2" | python -c "
import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO
inputs = sys.stdin.read().strip().split('\\n')  # Read all test case inputs
inputs = [line.split() for line in inputs]
res = list()
o = StringIO()
e = StringIO()
with redirect_stdout(o), redirect_stderr(e):
    for line in inputs:
        try:
            input_gen = iter(line)
            exec(
                '''$1''',
                {'input': lambda: next(input_gen)}
            )
            o.seek(0)
            output = o.getvalue().strip()
            error = e.getvalue().strip()
        except Exception:
            output = ''
            error = traceback.format_exc()
        res.append({'output': output, 'error': error})
print(res)
"
