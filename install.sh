#!/bin/sh
echo "running npm i"
npm i
if [ $? -eq 0 ]; then
  echo "running npm run build..."
  npm run build
  while [ $? != 0 ]
  do
    echo "failed to build go-cms-ui website files. trying again..."
    npm run build
  done
  echo "npm run build successful. copying dist files to www folder..."
  mkdir -p /var/www/html/go-cms-ui
  cp -rf dist/* /var/www/html/go-cms-ui/
  if [ $? -eq 0 ]; then
    echo "successfully installed go-cms-ui website files"
  else
    echo "failed to install go-cms-ui website files"
  fi
else
  echo "npm i failed"
fi
