Equation Parser
===============


A simple and fast mathematical equation evaluator in JavaScript.

This JavaScript file defines the global object EquationParser which has a single function parse(String equation).



License: New BSD License

Summary: A simple and fast mathematical equation parser.

Sample Usage:

	This evaluator only supports the basic mathematical primitives:
		- Addition			+
		- Subtraction		-
		- Multiplication	*
		- Division			/
		- Grouping			()

	ParseEquation('3 + 24');							// will return 27
	ParseEquation('4+7/(9-(1+3.5))+7/(9-(4--0.5))');	// will return 7.111111111111111
	
Notes:

	As size and performance were my primary considerations when making this, this
	parser is highly optimized, for both code size, execution speed, and memory
	footprint.
	As such neither mathematical functions nor custom operators are supported.

Exceptions:

	When division by zero is attempted, the string 'Division by zero' is thrown.
	When an invalid operator is found, the string 'Invalid argument' is thrown.
