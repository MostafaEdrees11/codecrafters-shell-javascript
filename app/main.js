const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "$ ",
});

// TODO: Uncomment the code below to pass the first stage
rl.prompt();
rl.question(`${rl.getPrompt()}`, (answer) => {
  console.log(`${answer}: command not found`)
  rl.close();
});