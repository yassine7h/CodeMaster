#!/usr/bin/env python3

import sys
import traceback
from contextlib import redirect_stdout, redirect_stderr
from io import StringIO

code = sys.argv[1]
testcases = sys.argv[2]

inputs = testcases.strip().split(';')
inputs = [line.split() for line in inputs]
res = list()
o = StringIO()
e = StringIO()
with redirect_stdout(o), redirect_stderr(e):
    for line in inputs:
        try:
            input_gen = iter(line)
            exec(
                code,
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
