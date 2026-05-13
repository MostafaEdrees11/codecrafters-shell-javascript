const fs = require('fs');

const cat = (undefined, args) => {
    let data = '';
    const indexOfRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
    try {
        if (indexOfRedirection !== -1) {
            let files = args.slice(0, indexOfRedirection);
            files.forEach(file => {
                data += fs.readFileSync(file, 'utf8');
            })
            const fileName = args[indexOfRedirection + 1];
            fs.writeFileSync(fileName, data);
        } else {
            args.forEach(file => {
                data += fs.readFileSync(file, 'utf8');
            })
            console.log(data);
        }
    } catch (err) {
        console.log(`cat: ${args[0]}: No such file or directory`);
        return;
    }
}

module.exports = {
    cat
}