const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();

let builtInCommands = ['echo', 'exit', 'type'];

rl.on('line', (input) => {
	if(input.includes(' ')) {
		let [command, ...args] = input.split(' ');
		
		if(isExitCommand(command)) {
			rl.close();
			return;
		}
		
		if(isTypeCommand(command)) {
			if(isBuiltInCommand(args[0])) {
				console.log(`${args[0]} is a shell builtin`);
			} else {
				console.log(`${args[0]}: not found`);
			}
		}
		
		if(isEchoCommand(command)) {
			console.log(...args);
		}
	} else {
		if(isExitCommand(input)) {
			rl.close();
			return;
		}
	
		console.log(`${input}: command not found`);	
	}
	rl.prompt();
})

const isExitCommand = command => command === 'exit';
const isEchoCommand = command => command === 'echo';
const isTypeCommand = command => command === 'type';
const isBuiltInCommand = command => builtInCommands.includes(command);