const readline = require("readline");
const { execFileSync } = require('node:child_process');

const { isExist } = require('./utils/isExit');
const { isBuiltInCommand } = require("./utils/isBuiltInCommand");
const { isExecutable } = require("./utils/isExecutable");
const { handleBuiltInCommands } = require("./utils/handleBuiltInCommands");
const { handleQuotes } = require("./utils/handleQuotes");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "$ ",
});

rl.prompt();
rl.on('line', (input) => {
	let command, args = [];

	if (input.startsWith('"') || input.startsWith("'")) {
		[command, ...args] = handleQuotes(input);
	} else {
		let indexOfFirstSpace = input.indexOf(' ') === -1 ? input.length : input.indexOf(' ');
		command = input.slice(0, indexOfFirstSpace);
		let resetOfInput = input.slice(indexOfFirstSpace + 1);
		args = handleQuotes(resetOfInput);
	}
	let { state, data } = isExecutable(command);

	if (isExist(command)) {
		rl.close();
		return;
	}

	if (isBuiltInCommand(command)) {
		handleBuiltInCommands(command, args);
	} else if (state) {
		let output = execFileSync(command, args);
		process.stdout.write(output.toString());
	} else {
		console.log(`${input}: command not found`);
	}
	rl.prompt();
})