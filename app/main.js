const readline = require("readline");
const fs = require("fs");
const path = require("path");
const { execSync } = require('node:child_process');

let builtInCommands = ['echo', 'exit', 'type'];
const envPath = process.env.PATH;
let dirs = [...envPath.split(path.delimiter)];

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
				let fileIsExistAndExecutable = false;
				
				for(let dir of dirs) {
					const targetPath = path.join(dir, args[0]);
					
					if(fs.existsSync(targetPath)) {
						try {
							fs.accessSync(targetPath, fs.constants.X_OK)
							console.log(`${args[0]} is ${targetPath}`);
							fileIsExistAndExecutable = true;
							break;
						} catch { continue; }
					}
				}
				if(!fileIsExistAndExecutable) console.log(`${args[0]}: not found`);
			}			
		}
	} else if(isExecutableCommand(command)) {
		let output = execSync(`${command} ${args.join(' ')}`);
		console.log(output.toString());
	} else {
		console.log(`${input}: command not found`);	
	}
	rl.prompt();
})

const isExitCommand = command => command === 'exit';
const isEchoCommand = command => command === 'echo';
const isTypeCommand = command => command === 'type';
const isBuiltInCommand = command => builtInCommands.includes(command);
const isExecutableCommand = command => {
	let isExecutableFile = false;
	for(dir of dirs) {
		const targetPath = path.join(dir, command);
		
		if(fs.existsSync(targetPath)) {
			try {
				fs.accessSync(targetPath, fs.constants.X_OK)
				isExecutableFile = true;
				break;
			} catch { continue; }
		}
	}
	
	return isExecutableFile;
}