let jobsList = [];

const jobs = () => {
	jobsList = jobsList.map((job, index) => {
		if (index === jobsList.length - 1) return { ...job, job_marker: '+' };
		else if (index === jobsList.length - 2) return { ...job, job_marker: '-' };
		else return { ...job, job_marker: ' ' };
	});

	jobsList.forEach((job) => {
		process.stdout.write(`[${job.job_number}]${job.job_marker}  ${job.status.padEnd(24)}${job.command}\n`);
	});
}

const saveBackgroundJobs = ({ job_number, process_id, command, status, job_marker = ' ' }) => {
	jobsList.push({ job_number, process_id, command, status, job_marker });
};

module.exports = {
	jobs,
	saveBackgroundJobs
}