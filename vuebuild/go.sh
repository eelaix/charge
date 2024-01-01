#!/bin/sh
echo
echo  npm install
echo  npm run serve
echo  npm run build:prod -- --dest=../dist2
echo  cp -rf dist/* ..
npm install --save
npm run build -- --dest=../docs
cp -rf dist/* ..