#!/bin/bash

# Create temp directory and Java file
TEMP_DIR=$(mktemp -d)
echo "$1" > "$TEMP_DIR/Main.java"

# Compile
javac "$TEMP_DIR/Main.java" 2> "$TEMP_DIR/compile_error.txt"
COMPILE_STATUS=$?

if [ $COMPILE_STATUS -ne 0 ]; then
    COMPILE_ERROR=$(cat "$TEMP_DIR/compile_error.txt")
    jq -n \
        --arg stdout "" \
        --arg stderr "$COMPILE_ERROR" \
        --arg status_code "$COMPILE_STATUS" \
        '{stdout: $stdout, stderr: $stderr, status_code: $status_code}'
    rm -rf "$TEMP_DIR"
    exit 0
fi

# Run with timeout
timeout 10s java -cp "$TEMP_DIR" Main > "$TEMP_DIR/output.txt" 2> "$TEMP_DIR/error.txt"
RUN_STATUS=$?

# Prepare output
STDOUT=$(cat "$TEMP_DIR/output.txt")
STDERR=$(cat "$TEMP_DIR/error.txt")

# Handle timeout
if [ $RUN_STATUS -eq 124 ]; then
    STDERR="Execution timed out"
fi

# Output JSON
jq -n \
    --arg stdout "$STDOUT" \
    --arg stderr "$STDERR" \
    --arg status_code "$RUN_STATUS" \
    '{stdout: $stdout, stderr: $stderr, status_code: $status_code}'

# Cleanup
rm -rf "$TEMP_DIR"