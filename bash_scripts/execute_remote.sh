#!/bin/bash

# Check if at least one argument (the URL) is provided
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <URL> [arg1 arg2 ... argN]"
    exit 1
fi

# The first argument is the URL
URL=$1

# Shift the first argument to get the remaining arguments, if any
shift

# Define a temporary file to store the downloaded script
TMP_SCRIPT=$(mktemp)

# Download the script
echo "Downloading script from $URL..."
curl -fsSL "$URL" -o "$TMP_SCRIPT"

# Check if the download was successful
if [ $? -ne 0 ]; then
    echo "Failed to download script from $URL"
    rm -f "$TMP_SCRIPT"
    exit 1
fi

# Make the script executable
chmod +x "$TMP_SCRIPT"

# Execute the script with any additional arguments and capture its output
SCRIPT_OUTPUT=$("$TMP_SCRIPT" "$@" 2>&1)

# Print the captured output
echo "Output from the executed script:"
echo "$SCRIPT_OUTPUT"

# Optionally, you can do additional processing with $SCRIPT_OUTPUT here

# Clean up by removing the temporary script
rm -f "$TMP_SCRIPT"
