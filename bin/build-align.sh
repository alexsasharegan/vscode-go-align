#!/usr/bin/env bash

CWD="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
PROJECT_ROOT=${CWD}/..;
ALIGN_ROOT=$GOPATH/src/github.com/guitarbum722/align;

ARCHS="darwin linux freebsd windows"
BUILD_CMD="go build -o"

cd $ALIGN_ROOT/cmd/align;
echo "Generating align release binaries..."
for arch in ${ARCHS}; do
  GOOS=${arch} GOARCH=amd64 ${BUILD_CMD} bin/align-${arch}
done

rm $PROJECT_ROOT/lib/*;
cd $ALIGN_ROOT/cmd/align/bin;
cp ./* $PROJECT_ROOT/lib/;
