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
const { handleBackgroundJobs } = require("./utils/handleBackgroundJobs");
const { reapBackgroundJobs, filterBackgroundJobs } = require("./built-in-commands/jobs");

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

rl.prompt();
rl.on('line', (input) => {
	if (input.trim()) {
		if (input.includes('|')) {
			let commands = input.split('|').map(cmd => cmd.trim());
			let [cmd1, ...args1] = handleQuotes(commands[0]);
			let [cmd2, ...args2] = handleQuotes(commands[1]);

			let cmd1Process = spawn(cmd1, args1, { stdio: ['ignore', 'pipe', 'inherit'] });
			let cmd2Process = spawn(cmd2, args2, { stdio: ['pipe', 'pipe', 'inherit'] });

			cmd1Process.stdout.pipe(cmd2Process.stdin);
			cmd2Process.stdout.pipe(process.stdout);

			Promise.all([
				new Promise((resolve) => cmd1Process.on('exit', resolve)),
				new Promise((resolve) => cmd2Process.on('exit', resolve))
			]).then(() => {
				rl.prompt();
			});
		} else {
			let [command, ...args] = handleQuotes(input);

			if (args[args.length - 1] === '&') {
				handleBackgroundJobs(input, command, args);
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
			let jobs = reapBackgroundJobs();
			if (jobs.length > 0) {
				jobs.forEach((job) => {
					job.status === "Done" && process.stdout.write(`[${job.job_number}]${job.job_marker}  ${job.status.padEnd(24)}${job.command.slice(0, job.command.indexOf('&') - 1).trim()}\n`);
				});
			}
			filterBackgroundJobs();
			rl.prompt();
		}
	}
})