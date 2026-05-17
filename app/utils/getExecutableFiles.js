const fs = require('fs');
const path = require('path');

function getExecutableFiles() {
    const pathDirs = (process.env.PATH || '').split(path.delimiter);
    let executables = [];

    pathDirs.forEach(dir => {
        try {
            if (fs.existsSync(dir) && fs.statSync(dir).isDirectory()) {
                const files = fs.readdirSync(dir);

                files.forEach(file => {
                    const fullPath = path.join(dir, file);
                    try {
                        const stats = fs.statSync(fullPath);
                        if (stats.isFile()) {
                            fs.accessSync(fullPath, fs.constants.X_OK);
                            executables.push(fullPath);
                        }
                    } catch { }
                });
            }
        } catch { }
    });

    executables = [...new Set(executables)];
    executables = executables.map(file => file.split(path.sep).pop());
    return executables;
}

module.exports = {
    getExecutableFiles
}