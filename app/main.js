const readline = require("readline");
const { execFileSync, spawn } = require('node:child_process');

const { isExist } = require('./utils/isExit');
const { isBuiltInCommand } = require("./utils/isBuiltInCommand");
const { isExecutable } = require("./utils/isExecutable");
const { getExecutableFiles } = require("./utils/getExecutableFiles");
const { handleBuiltInCommands } = require("./utils/handleBuiltInCommands");
const { handleQuotes } = require("./utils/handleQuotes");
const { isExternalCommand } = require("./utils/isExternalCommand");
const { handleExternalCommands } = require("./utils/handleExternalCommands");
const { longestCommonPrefix } = require("./utils/longestCommonPrefix");
const { handleTabKeyPress } = require("./utils/handleTabKeyPress");

let tabState = {
	isPressed: false,
	line: null
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "$ ",
	completer: (line) => {
		let [command, ...args] = line.split(' ');
		let isCommand = !args.length;
		return handleTabKeyPress(rl, isCommand ? command : args[args.length - 1], isCommand, isCommand ? '' : command, args);
	}
});

let backgroundJobsCounter = 1;

rl.prompt();
rl.on('line', (input) => {
	if (input.trim()) {
		let [command, ...args] = handleQuotes(input);

		if (args[args.length - 1] === '&') {
			let job = spawn(command, args.slice(0, args.length - 1), {
				stdio: 'inherit'
			});
			process.stdout.write(`[${backgroundJobsCounter}] ${job.pid}\n`);
			backgroundJobsCounter++;
		} else {
			if (isBuiltInCommand(command)) {
				handleBuiltInCommands(command, args);
			} else if (isExternalCommand(command)) {
				handleExternalCommands(command, args);
			} else {
				let { state, data } = isExecutable(command);
				if (state) {
					let output = execFileSync(command, args);
					process.stdout.write(output.toString());
				} else {
					console.log(`${input}: command not found`);
				}
			}
		}
	}
	rl.prompt();
})