const ls = (undefined, args) => {
	const fs = require('fs');

	const indexOfOutputRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
	const indexOfErrorRedirection = args.findIndex(arg => arg === '2>');
	const redirectionIndex = indexOfOutputRedirection !== -1 && indexOfErrorRedirection !== -1 ? Math.min(indexOfOutputRedirection, indexOfErrorRedirection) :
		indexOfOutputRedirection !== -1 ? indexOfOutputRedirection : indexOfErrorRedirection;
	const filePerLine = args.findIndex(arg => arg === '-1');

	let folders = args.slice(0, redirectionIndex !== -1 ? redirectionIndex : args.length);
	folders = filePerLine === -1 ? folders : folders.filter(f => f !== '-1');

	let output = '';
	try {
		if (folders.length > 1) {
			folders.forEach((folder, index) => {
				output += `${folder}:\n`;
				let folderFiles = fs.readdirSync(folder);
				if (filePerLine !== -1) {
					output += folderFiles.join('\n') + '\n';
				} else {
					output += folderFiles.join(' ') + '\n';;
				}
				if (index < (folders.length - 1)) output += '\n';
			})
		} else {
			let folderFiles = fs.readdirSync(folders[0]);
			if (filePerLine !== -1) {
				output += folderFiles.join('\n') + '\n';
			} else {
				output += folderFiles.join(' ') + '\n';;
			}
		}

		if (indexOfOutputRedirection === -1) {
			process.stdout.write(output);
		}
	} catch (err) {
		const path = require('node:path');
		if (indexOfErrorRedirection !== -1) {
			const fs = require('fs');
			const fileName = args[indexOfErrorRedirection + 1];
			fs.writeFileSync(fileName, `ls: ${path.basename(err.path)}: No such file or directory\n`);

			if (output !== '') process.stdout.write(output);
		}

		if (indexOfOutputRedirection !== -1) {
			process.stdout.write(`ls: ${path.basename(err.path)}: No such file or directory\n`);
		}
	} finally {
		if (output !== '' && indexOfOutputRedirection !== -1) {
			const fileName = args[indexOfOutputRedirection + 1];
			fs.writeFileSync(fileName, output);
		}
	}
}

module.exports = {
	ls
}