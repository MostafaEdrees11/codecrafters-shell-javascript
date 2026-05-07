const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();

rl.on('line', (input) => {
	if(input.includes(' ')) {
		let [command, ...args] = input.split(' ');
		
		if(isExitCommand(command)) {
			rl.close();
			return;
		}
		
		if(command === 'echo') {
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
