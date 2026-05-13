const fs = require('fs');
const path = require('node:path');

const dirs = [...process.env.PATH.split(path.delimiter)];

const isExecutable = (command) => {
    let isExecutableFile = false, targetPath = '';

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

module.exports = {
    isExecutable
}