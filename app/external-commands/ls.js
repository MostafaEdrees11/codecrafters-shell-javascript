const ls = (undefined, args) => {
	const fs = require('fs');

	const indexOfOutputRedirection = args.findIndex(arg => arg === '>' || arg === '1>');
	const indexOfErrorRedirection = args.findIndex(arg => arg === '2>');
	const indexOfAppendOutput = args.findIndex(arg => arg === '>>' || arg === '1>>');
	const indexOfAppendError = args.findIndex(arg => arg === '2>>');
	const indexOfOutput = indexOfOutputRedirection !== -1 ? indexOfOutputRedirection : indexOfAppendOutput;
	const indexOfError = indexOfErrorRedirection !== -1 ? indexOfErrorRedirection : indexOfAppendError;
	const redirectionIndex = indexOfOutput !== -1 && indexOfError !== -1 ? Math.min(indexOfOutput, indexOfError) :
		indexOfOutput !== -1 ? indexOfOutput : indexOfError;
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

		if (indexOfOutput === -1) {
			process.stdout.write(output);
		}
	} catch (err) {
		const path = require('node:path');
		if (indexOfError !== -1) {
			const fileName = args[indexOfError + 1];
			if (indexOfErrorRedirection !== -1) {
				fs.writeFileSync(fileName, `ls: ${path.basename(err.path)}: No such file or directory\n`);
			} else if (indexOfAppendError !== -1) {
				fs.appendFileSync(fileName, `ls: ${path.basename(err.path)}: No such file or directory\n`);
			}

			if (output !== '') process.stdout.write(output);
		}

		if (indexOfOutput !== -1) {
			const fileName = args[indexOfOutput + 1];
			fs.writeFileSync(fileName, ``);
			process.stdout.write(`ls: ${path.basename(err.path)}: No such file or directory\n`);
		}
	} finally {
		if (output !== '') {
			const fileName = args[indexOfOutput + 1];
			if (indexOfOutputRedirection !== -1) {
				fs.writeFileSync(fileName, output);
			} else if (indexOfAppendOutput !== -1) {
				fs.appendFileSync(fileName, output);
			}
		}
	}
}

module.exports = {
	ls
}