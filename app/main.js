const readline = require("readline");
const { execFileSync } = require('node:child_process');

const { isExist } = require('./utils/isExit');
const { isBuiltInCommand } = require("./utils/isBuiltInCommand");
const { isExecutable } = require("./utils/isExecutable");
const { handleBuiltInCommands } = require("./utils/handleBuiltInCommands");
const { handleQuotes } = require("./utils/handleQuotes");
const { isExternalCommand } = require("./utils/isExternalCommand");
const { handleExternalCommands } = require("./utils/handleExternalCommands");

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "$ ",
	completer: (line) => {
		const commands = ['echo ', 'exit '];
		const hits = commands.filter((cmd) => cmd.startsWith(line));
		return [hits.length ? hits : commands, line];
	}
});

rl.prompt();
rl.on('line', (input) => {
	if (input.trim()) {
		let [command, ...args] = handleQuotes(input);

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
	rl.prompt();
})