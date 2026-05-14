const fs = require('fs');
const path = require('node:path');

const cat = (undefined, args) => {
    let data = '';
    const indexOfRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
    let files = args.slice(0, indexOfRedirection !== -1 ? indexOfRedirection : args.length);

    try {
        files.forEach(file => {
            data += fs.readFileSync(file, 'utf8');
        })

        if (indexOfRedirection === -1) {
            process.stdout.write(data);
        }
    } catch (err) {
        console.log(`cat: ${path.basename(err.path)}: No such file or directory`);
    } finally {
        if (data !== '' && indexOfRedirection !== -1) {
            const fileName = args[indexOfRedirection + 1];
            fs.writeFileSync(fileName, data);
        }
    }
}

module.exports = {
    cat
}