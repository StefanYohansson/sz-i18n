REPORTER = spec

test:
	mocha --reporter $(REPORTER) tests/*.js --compilers js:babel-core/register --require babel-polyfill

all:
	test
