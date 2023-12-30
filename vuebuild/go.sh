#!/bin/sh
echo
echo  npm install
echo  npm run serve
echo  npm run build
echo  cp -rf dist/* ..
npm install --save
npm run build
cp -rf dist/* ..