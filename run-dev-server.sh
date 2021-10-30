# this won't work in a Makefile because `pushd` and `popd` don't exist in `sh`
pushd src && python3 -m http.server && popd
