const fs = require('fs');

const cat = (undefined, args) => {
    let data = '';
    args.forEach(file => {
        data += fs.readFileSync(file, 'utf8');
    })
    process.stdout.write(data);
}

module.exports = {
    cat
}