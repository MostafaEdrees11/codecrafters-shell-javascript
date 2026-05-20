const readline = require("readline");
const { execFileSync } = require('node:child_process');

const { isExist } = require('./utils/isExit');
const { isBuiltInCommand } = require("./utils/isBuiltInCommand");
const { isExecutable } = require("./utils/isExecutable");
const { getExecutableFiles } = require("./utils/getExecutableFiles");
const { handleBuiltInCommands } = require("./utils/handleBuiltInCommands");
const { handleQuotes } = require("./utils/handleQuotes");
const { isExternalCommand } = require("./utils/isExternalCommand");
const { handleExternalCommands } = require("./utils/handleExternalCommands");
const { longestCommonPrefix } = require("./utils/longestCommonPrefix");

let tabState = {
	isPressed: false,
	line: null
}

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "$ ",
	completer: (line) => {
		const executables = getExecutableFiles();
		const commands = ['echo ', 'exit ',
			...executables
				.map(cmd => cmd + ' ')];
		const hits = commands.filter((cmd) => cmd.startsWith(line));

		if (hits.length === 0) {
			process.stdout.write('\u0007');
			return [[], line];
		}
		if (hits.length > 1) {
			hits.sort();
			let prefix = longestCommonPrefix(hits.filter(cmd => cmd !== line));

			if (prefix.length && prefix !== line) {
				rl.write(`${prefix.slice(line.length)}`);
				line += prefix.slice(line.length);
				tabState.isPressed = true;
				tabState.line = line;
				return [[], line];
			} else {
				if (tabState?.line === line) {
					if (!tabState.isPressed) {
						process.stdout.write('\u0007');
						tabState.isPressed = true;
						return [[], line];
					} else {
						tabState.isPressed = false;
						tabState.line = line;
						process.stdout.write('\n' + hits.join('') + '\n');
						setImmediate(() => rl.prompt(true));
						return [[], line];
					}
				} else {
					tabState.isPressed = true;
					tabState.line = line;
					process.stdout.write('\u0007');
					return [[], line];
				}
			}
		}
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