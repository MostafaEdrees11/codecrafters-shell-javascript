const { getExecutableFiles } = require("./getExecutableFiles");
const { longestCommonPrefix } = require("./longestCommonPrefix");

let tabState = {
    isPressed: false,
    line: null
}

const handleTabKeyPress = (rl, line, isCommand) => {

    let hits = [], searchArr = [];

    if (isCommand) {
        const executables = getExecutableFiles();
        searchArr = ['echo ', 'exit ',
            ...executables
                .map(cmd => cmd + ' ')];
        hits = searchArr.filter((cmd) => cmd.startsWith(line));
    } else {
        const fs = require('fs');
        let cwd = process.cwd();
        searchArr = fs.readdirSync(cwd)
            .map(file => {
                let filePath = `${cwd}/${file}`;
                if (fs.statSync(filePath).isFile()) {
                    return file + ' ';
                }
                return '';
            });
        hits = searchArr.filter(file => file.startsWith(line));
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

    return [hits.length ? hits : searchArr, line];
}

module.exports = { handleTabKeyPress };