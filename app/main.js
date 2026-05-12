const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require('node:child_process');

let builtInCommands = ['echo', 'exit', 'type', 'pwd', 'cd'];
const envPath = process.env.PATH;
let dirs = [...envPath.split(path.delimiter)];

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	prompt: "$ ",
});

rl.prompt();
rl.on('line', (input) => {
	let indexOfFirstSpace = input.indexOf(' ') === -1 ? input.length : input.indexOf(' ');
	let command = input.slice(0, indexOfFirstSpace);
	let resetOfInput = input.slice(indexOfFirstSpace + 1);
	let args = constructArgs(resetOfInput);
	let { state, data } = isExecutableCommand(command);

	if (isExitCommand(command)) {
		rl.close();
		return;
	} else if (isEchoCommand(command)) {
		console.log(args.join(' '));
	} else if (isTypeCommand(command)) {
		if (args.length > 0) {
			if (isBuiltInCommand(args[0])) {
				console.log(`${args[0]} is a shell builtin`);
			} else {
				let { state, data } = isExecutableCommand(args[0]);
				if (state) {
					console.log(`${args[0]} is ${data}`)
				} else {
					console.log(`${args[0]}: not found`);
				}
			}
		}
	} else if (isPWDCommand(command)) {
		console.log(process.cwd());
	} else if (isCDCommand(command)) {
		if (args.length > 0) {
			try {
				if (args[0] === '~') process.chdir(process.env.HOME);
				else process.chdir(args[0]);
			} catch {
				console.log(`cd: ${args[0]}: No such file or directory`);
			}
		}
	} else if (isCatCommand(command)) {
		let data = '';
		args.forEach(arg => {
			data += fs.readFileSync(arg, 'utf8');
		})
		process.stdout.write(data);
	} else if (state) {
		let output = execSync(`${command} ${args.join(' ')}`);
		process.stdout.write(output.toString());
	} else {
		console.log(`${input}: command not found`);
	}
	rl.prompt();
})

const isExitCommand = command => command === 'exit';
const isEchoCommand = command => command === 'echo';
const isTypeCommand = command => command === 'type';
const isBuiltInCommand = command => builtInCommands.includes(command);
const isPWDCommand = command => command === 'pwd';
const isCDCommand = command => command === 'cd';
const isCatCommand = command => command === 'cat';

const isExecutableCommand = (command) => {
	let isExecutableFile = false;
	let targetPath = null;
	for (let dir of dirs) {
		targetPath = path.join(dir, command);

		if (fs.existsSync(targetPath)) {
			try {
				fs.accessSync(targetPath, fs.constants.X_OK)
				isExecutableFile = true;
				break;
			} catch { continue; }
		}
	}
	return { state: isExecutableFile, data: targetPath };
}


const constructArgs = (resetOfInput) => {
	let counter = 0, temp = '', args = [];
	let quote = {
		hasQuote: false,
		quoteSign: ''
	}
	while (counter < resetOfInput.length) {
		if(resetOfInput[counter] === "\\") {
			temp += resetOfInput[counter + 1];
			counter += 2;
			continue;
		}
		
		if (resetOfInput[counter] === "'" || resetOfInput[counter] === '"') {
			if(quote.quoteSign === "") quote.quoteSign = resetOfInput[counter];
			
			if(quote.hasQuote) {
				if(temp.length > 1 && resetOfInput[counter] === quote.quoteSign) temp = temp.replace(quote.quoteSign, "");
				else temp += resetOfInput[counter];
			}
			else temp += resetOfInput[counter];

			if(resetOfInput[counter] === quote.quoteSign) quote.hasQuote = !quote.hasQuote;
			counter++;
			continue;
		}

		if (!quote.hasQuote && resetOfInput[counter] === ' ' && temp.length > 0) {
			args.push(temp);
			temp = '';
			counter++;
			continue;
		}

		if (!quote.hasQuote && resetOfInput[counter] === ' ' && temp.length === 0) {
			counter++;
			continue;
		}

		temp += resetOfInput[counter];
		counter++;
	}

	if(temp.length > 0) args.push(temp);
	return args;
}