let jobsList = [];

const jobs = () => {
	jobsList = jobsList.map((job, index) => {
		if (index === jobsList.length - 1) return { ...job, job_marker: '+' };
		else if (index === jobsList.length - 2) return { ...job, job_marker: '-' };
		else return { ...job, job_marker: ' ' };
	});

	jobsList.forEach((job) => {
		process.stdout.write(`[${job.job_number}]${job.job_marker}  ${job.status.padEnd(24)}${job.status === "Done"? job.command.slice(0, job.command.indexOf('&') - 1) : job.command}\n`);
	});
	
	jobsList = jobsList.filter((job) => job.status !== "Done");
}

const saveBackgroundJobs = ({ job_number, process_id, command, status, job_marker = ' ' }) => {
	let jobIndex = jobsList.findIndex((job) => job.job_number === job_number);
	if(jobIndex === -1)
		jobsList.push({ job_number, process_id, command, status, job_marker });
	else
		jobsList[jobIndex] = { job_number, process_id, command, status, job_marker };
};

module.exports = {
	jobs,
	saveBackgroundJobs
}