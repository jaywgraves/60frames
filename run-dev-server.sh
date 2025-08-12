#!/usr/bin/env bash

# this won't work in a Makefile because `pushd` and `popd` don't exist in `sh`
echo http://localhost:8000
pushd src && python3 -m http.server && popd
