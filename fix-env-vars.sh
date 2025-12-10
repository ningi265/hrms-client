#!/bin/bash

# Replace process.env.REACT_APP_ with import.meta.env.VITE_
find src -type f \( -name "*.js" -o -name "*.jsx" \) -exec sed -i 's/process\.env\.REACT_APP_/import.meta.env.VITE_/g' {} \;

echo "Environment variables updated!"
