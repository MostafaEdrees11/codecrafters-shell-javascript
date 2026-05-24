const fs = require('fs');
const path = require('path');

const { getExecutableFiles } = require("./getExecutableFiles");
const { longestCommonPrefix } = require("./longestCommonPrefix");
const { getRegisteredCommands } = require("../built-in-commands/complete");
const { execFileSync } = require("child_process")

let tabState = {
    isPressed: false,
    line: null
}

const handleTabKeyPress = (rl, line, isCommand, command, args) => {
    let hits = [], searchArr = [];

    if (isCommand) {
        const executables = getExecutableFiles();
        searchArr = ['echo ', 'exit ',
            ...executables
                .map(cmd => cmd + ' ')];
        hits = searchArr.filter((cmd) => cmd.startsWith(line));
    } else {
        let registeredCommands = getRegisteredCommands();
        let targetPath = process.cwd(), relativePath = '', fileName = line;

        if (registeredCommands.hasOwnProperty(command)) {
            let customEnv = {
                ...process.env,
                COMP_LINE: command + ' ' + args.join(' '),
                COMP_POINT: (command + ' ' + args.join(' ')).length
            }

            let argv1 = command;
            let argv2 = line;
            let argv3 = args.length > 1 ? args[args.length - 2] : command;
            let data = execFileSync(registeredCommands[command], [argv1, argv2, argv3], { env: customEnv });
            searchArr = data.toString().split('\n').map(cmd => cmd + ' ');

            if (fileName !== '') {
                hits = searchArr.filter(cmd => cmd.startsWith(line));
            } else {
                hits = [searchArr[0]];
            }
        } else {
            if (line.includes('/')) {
                fileName = line.split('/').slice(-1)[0];
                relativePath = line.slice(0, line.lastIndexOf('/'));
                targetPath = path.join(process.cwd(), relativePath);
            }

            try {
                searchArr = fs.readdirSync(targetPath);
                if (fileName !== '') {
                    hits = searchArr.filter(file => file.startsWith(fileName)).map(file => {
                        let filePath = `${targetPath}/${file}`;

                        if (fs.statSync(filePath).isDirectory()) {
                            return line.includes('/') ? relativePath + '/' + file + '/' : file + '/';
                        }
                        return line.includes('/') ? relativePath + '/' + file + ' ' : file + ' ';
                    });
                } else {
                    let filePath = `${targetPath}/${searchArr[0]}`;

                    if (fs.statSync(filePath).isDirectory()) {
                        hits = [line.includes('/') ? relativePath + '/' + searchArr[0] + '/' : searchArr[0] + '/'];
                    } else {
                        hits = [line.includes('/') ? relativePath + '/' + searchArr[0] + ' ' : searchArr[0] + ' '];
                    }
                }
            } catch (err) {
                console.log("error");
            }
        }
    }

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
                    process.stdout.write('\n' + hits.join(' ') + '\n');
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

    return [hits.length ? hits : searchArr, line];
}

module.exports = { handleTabKeyPress };