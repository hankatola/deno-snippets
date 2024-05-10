#!/bin/bash

# Minimum number of arguments needed is 1 (the URL)
if [ "$#" -lt 1 ]; then
    echo "Usage: $0 <URL> [arg1 arg2 ... argN]"
    exit 1
fi

# The first argument is the URL
URL=$1

# Remaining arguments (if any) will be passed to the downloaded script
shift  # This command shifts the positional parameters to the left, so $2 becomes $1, $3 becomes $2, etc.

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

# Execute the script with all additional arguments
echo "Running the script with arguments $@"
"$TMP_SCRIPT" "$@"

# Clean up by removing the temporary script
rm -f "$TMP_SCRIPT"
