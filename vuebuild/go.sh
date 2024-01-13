#!/bin/sh
echo
echo  npm install --save
echo  npm run serve
echo  npm run build -- --dest=../docs
echo  cp -rf dist/* ..
echo  npm install --save
npm run build -- --dest=../docs
