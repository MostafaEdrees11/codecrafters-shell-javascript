let jobsList = [];
let backgroundJobsCounter = 1;

const jobs = () => {

	jobsList = reapBackgroundJobs();

	if (jobsList.length > 0) {
		jobsList.forEach((job) => {
			process.stdout.write(`[${job.job_number}]${job.job_marker}  ${job.status.padEnd(24)}${job.status === "Done" ? job.command.slice(0, job.command.indexOf('&') - 1).trim() : job.command}\n`);
		});
	}

	filterBackgroundJobs();
}

const reapBackgroundJobs = () => {
	if (jobsList.length > 0) {
		jobsList = jobsList.map((job) => {
			if (job.process.exitCode !== null) return { ...job, status: "Done" };
			else return job;
		})

		jobsList = jobsList.map((job, index) => {
			if (index === jobsList.length - 1) return { ...job, job_marker: '+' };
			else if (index === jobsList.length - 2) return { ...job, job_marker: '-' };
			else return { ...job, job_marker: ' ' };
		});
	}

	return jobsList;
}

const filterBackgroundJobs = () => {
	jobsList = jobsList.filter((job) => job.status !== "Done");
}

const saveBackgroundJobs = ({ job_number, process, command, status, job_marker = ' ' }) => {
	let jobIndex = jobsList.findIndex((job) => job.process.pid === process.pid);
	if (jobIndex === -1)
		jobsList.push({ job_number, process, command, status, job_marker });
	else
		jobsList[jobIndex] = { job_number, process, command, status, job_marker };
};

const getBackgroundJobsCounter = () => backgroundJobsCounter;

const incrementJobCounter = () => {
	backgroundJobsCounter++;
};

module.exports = {
	jobs,
	saveBackgroundJobs,
	getBackgroundJobsCounter,
	incrementJobCounter,
	reapBackgroundJobs,
	filterBackgroundJobs
}