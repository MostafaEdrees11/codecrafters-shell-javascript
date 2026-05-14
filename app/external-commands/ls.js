const ls = (undefined, args) => {
    const fs = require('fs');

	const indexOfRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
	const filePerLine = args.findIndex(arg => arg === '-1');
	
	let folders = args.slice(0, indexOfRedirection === -1 ? args.length : indexOfRedirection);
	folders = filePerLine === -1? folders : folders.filter(f => f !== '-1');

	let output = '';
	if(folders.length > 1) {
		folders.forEach((folder, index) => {
			output += `${folder}:\n`;
			let folderFiles = fs.readdirSync(folder);
			if(filePerLine !== -1) {
				output += folderFiles.join('\n') + '\n';
			} else {
				output += folderFiles.join(' ') + '\n';;
			}
			if(index < (folders.length - 1)) output += '\n';
		})
	} else {
		let folderFiles = fs.readdirSync(folders[0]);
		if(filePerLine !== -1) {
			output += folderFiles.join('\n') + '\n';
		} else {
			output += folderFiles.join(' ') + '\n';;
		}
	}

	if(indexOfRedirection !== -1) {
		const fileName = args[indexOfRedirection + 1];
		fs.writeFileSync(fileName, output);
	} else {
		process.stdout.write(output);
	}
}

module.exports = {
    ls
}