/*

Author: Jonathon Reesor a.k.a "Symaxian"

License: New BSD License

Summary: A simple and fast mathematical equation parser.

Sample Usage:

	This evaluator only supports the basic mathematical primitives:
		Addition		+
		Subtraction		-
		Multiplication	*
		Division		/
		Grouping		()

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

*/

EquationParser = (function() {

	'use strict';

	var parser = {};

	// Computes the given mathematical operations out of the passed equation array
	// Operators not specified will be ignored
	// Operates in-place on the passed equation array
	/** @type {Function} */
	parser.applyRule = function applyRule(ar, op1, op2) {

		var i, num1, num2, opCode, ans;

		// Starting at 1 is an optimization, there should never be an operator as the first element
		for(i = 1; i < ar.length; i++) {
			opCode = ar[i];
			// Check if its an operator we need to compute
			if(opCode === op1 || opCode === op2) {
				// Get the operands
				num1 = ar[i - 1];
				num2 = ar[i + 1];
				// Compute the equation
				if(opCode === 43) {
					ans = num1 + num2;
				}
				else if(opCode === 45) {
					ans = num1 - num2;
				}
				else if(opCode === 42) {
					ans = num1 * num2;
				}
				else if(opCode === 47) {
					// Check if dividing by 0
					if(num2 === 0) {
						throw 'Division by zero';
					}
					ans = num1 / num2;
				}
				else {
					// Unknown operator/argument
					throw 'Invalid argument';
				}
				// Replace num1, op, and num2 in the array with the result
				ar.splice(i-1, 3, ans);
				// Restart at the beginning, -1 because -1+2 === 1
				i = -1;
			}
		}

	};

	// Recursively parses an equation, returning a number or throwing an error message
	/** @type {Function} */
	parser.parse = function parse(s) {

		var i, charCode,
			prevGrpChar,
			group,
			ar = [],
			leftCode,
			start = 0;

		// '+' => 43
		// '-' => 45
		// '*' => 42
		// '/' => 47
		// '(' => 40
		// ')' => 41

		// Loop through to remove groups while any exist
		while((s.indexOf('(') !== -1) && (s.indexOf(')') !== -1)) {
			for(i = s.indexOf('('); i < s.length; i++) {
				charCode = s.charCodeAt(i);
				// Save the start position of the group
				if(charCode === 40) {
					start = i + 1;
				}
				// Ignore other characters that is not a group symbol
				if(charCode === 40 || charCode === 41) {
					// If this is a leaf group(no inner groups), collapse it
					if(prevGrpChar === 40 && charCode === 41) {
						// Replace the group in s with the result of parsing the group, without the parens
						s = s.substr(0, start-1) + parser.parse(s.substr(start, i-start)) + s.substr(i+1);
					}
					// Track the previous group symbol
					prevGrpChar = charCode;
				}
			}
		}

		// Parse the equation, separating operators and operands into an array
		for(i = 1; i < s.length; i++) {
			// Get the current char code
			charCode = s.charCodeAt(i);
			// Ignore if its not an operator, numbers will be skipped
			if(charCode === 43 || charCode === 45 || charCode === 42 || charCode === 47) {
				// Get the char code left of the current character
				leftCode = s.charCodeAt(i-1);
				// Evaluate if the operator is actually a "sign"
				// This is for negative numbers where the left character is usually a math operator
				if(leftCode !== 43 && leftCode !== 45 && leftCode !== 42 && leftCode !== 47) {
					// Parse the number starting from the index of the previous operator up to the current one
					// Add the operator to the array
					ar.push(Number(s.substr(start, i-start)), charCode);
					// Track the index of the current operator
					// This will be used for the next numeric parsing
					start = i + 1;
				}
			}
		}

		// If there were no operators, assume s is just a number and return it
		if(ar.length === 0) {
			return Number(s);
		}

		// The right most element will not be included when parsing so we have to add it to the array based on the last index of the last operator
		if(start > 0) {
			ar.push(Number(s.substr(start)));
		}

		// Apply MDAS rules to the equation
		parser.applyRule(ar, 42, 47);
		parser.applyRule(ar, 43, 45);

		// Return the final answer of the computation
		if(ar.length) {
			return ar[0];
		}

		// Something bad happened
		return 0;

	};

	return parser;

})();