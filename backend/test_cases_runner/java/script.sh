#!/bin/bash

mkdir -p /tmp/java
echo "import java.util.Scanner;" > /tmp/java/Solution.java
echo "$1" >> /tmp/java/Solution.java

# Compile and capture compilation errors
compile_output=$(javac /tmp/java/Solution.java 2>&1)
compile_status=$?

if [ $compile_status -ne 0 ]; then
    jq -n \
        --arg status "compilation_error" \
        --arg error "$compile_output" \
        '{status: $status, error: $error, test_results: []}'
    exit 1
fi

# Process each test case
IFS=';' read -ra TESTS <<< "$2"
test_results=()
test_number=0

for test in "${TESTS[@]}"; do
    test_number=$((test_number + 1))

    # Create a temporary file for the test output and errors
    output_file=$(mktemp)
    error_file=$(mktemp)

    # Run the test and capture both stdout and stderr
    echo "${test}" | tr ' ' '\n' | \
        timeout 10s java -cp /tmp/java Solution > "$output_file" 2> "$error_file"

    execution_status=$?
    output=$(cat "$output_file")
    error=$(cat "$error_file")

    # Determine test status
    if [ $execution_status -eq 124 ]; then
        status="timeout"
    elif [ $execution_status -ne 0 ]; then
        status="runtime_error"
    else
        status="success"
    fi

    # Add test result to array
    test_results+=("$(jq -n \
        --arg test_number "$test_number" \
        --arg input "$test" \
        --arg status "$status" \
        --arg output "$output" \
        --arg error "$error" \
        '{test_number: $test_number, input: $input, status: $status, output: $output, error: $error}')")

    # Cleanup temporary files
    rm "$output_file" "$error_file"
done

# Output final JSON with all test results
jq -n \
    --arg status "completed" \
    --arg total_tests "$test_number" \
    --argjson results "$(printf '%s\n' "${test_results[@]}" | jq -s '.')" \
    '{status: $status, total_tests: $total_tests, test_results: $results}'