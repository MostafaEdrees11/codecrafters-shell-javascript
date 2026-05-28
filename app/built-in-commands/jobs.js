let jobsList = [];

const jobs = () => {
	jobsList.forEach((job) => {
		process.stdout.write(`[${job.job_number}]+  ${job.status.padEnd(24)}${job.command}\n`);
	})
}

module.exports = {
	jobsList,
	jobs
}