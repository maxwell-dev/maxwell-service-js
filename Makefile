.PHONY : default install build start test clean

NPM=npm

default: build

install:
	${NPM} install

build:
	${NPM} run build

serve:
	${NPM} run serve

test:
	${NPM} run test

clean:
	${NPM} run-script clean
