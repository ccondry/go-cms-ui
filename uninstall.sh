#!/bin/sh
echo "removing go-cms-ui website files..."
rm -rf /var/www/html/go-cms-ui/*
if [ $? -eq 0 ]; then
  echo "successfully removed go-cms-ui website files."
else
  echo "failed to remove go-cms-ui website files."
fi
