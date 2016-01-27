REPORTER = spec

test:
	mocha --reporter $(REPORTER) tests/*.coffee --compilers coffee:coffee-script/register

all:
	test
