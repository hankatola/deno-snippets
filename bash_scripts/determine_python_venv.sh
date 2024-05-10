#!/bin/bash

# Check if the PYTHON environment variable is set
if [ -z "$PYTHON" ]; then
  PYTHON=python
fi

# Check if Python is running inside a virtual environment
if [ -z "$VIRTUAL_ENV" ]; then
  echo "Python is not running in a virtual environment."
else
  echo "Python is running in a virtual environment at $VIRTUAL_ENV"
  echo "Python executable location: $($PYTHON -c 'import sys; print(sys.executable)')"
fi
