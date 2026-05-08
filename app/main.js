const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { exec } = require('node:child_process');

let builtInCommands = ['echo', 'exit', 'type'];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

rl.prompt();
rl.on('line', (input) => {
	let [command, ...args] = input.split(' ');
	
	if(isExitCommand(command)) {
		rl.close();
		return;
	} else if(isEchoCommand(command)) {
		console.log(...args);
	} else if(isTypeCommand(command)) {
		if(args.length > 0) {
			if(isBuiltInCommand(args[0])) {
				console.log(`${args[0]} is a shell builtin`);
			} else {
				const envPath = process.env.PATH;
				let dirs = [...envPath.split(path.delimiter)];
				let fileIsExistAndExecutable = false;
				
				for(let dir of dirs) {
					const targetPath = path.join(dir, args[0]);
					
					if(fs.existsSync(targetPath)) {
						if(isExecutableCommand(targetPath)) {
							console.log(`${args[0]} is ${targetPath}`);
							fileIsExistAndExecutable = true;
							break;
						}
					}
				}
				if(!fileIsExistAndExecutable) console.log(`${args[0]}: not found`);
			}			
		}
	} else if(isExecutableCommand(path.join(command))) {
		exec(`${command} ${...args}`);
	} else {
		console.log(`${input}: command not found`);	
	}
	rl.prompt();
})

const isExitCommand = command => command === 'exit';
const isEchoCommand = command => command === 'echo';
const isTypeCommand = command => command === 'type';
const isBuiltInCommand = command => builtInCommands.includes(command);

const isExecutableCommand = (command) => {
	try {
		fs.accessSync(command, fs.constants.X_OK);
		return true;
	} catch {
		return false;
	}
}