const { spawn } = require('node:child_process');
const { saveBackgroundJobs, getBackgroundJobsCounter, incrementJobCounter } = require("../built-in-commands/jobs");

const handleBackgroundJobs = (input, command, args) => {
    let job = spawn(command, args.slice(0, args.length - 1), {
        stdio: 'inherit',
        detached: true,
        shell: false
    });
    job.unref();

    let jobNumber = getBackgroundJobsCounter();
    let backgroundJob = {
        job_number: jobNumber,
        process: job,
        command: input,
        status: "Running",
    };
    saveBackgroundJobs(backgroundJob);
    process.stdout.write(`[${jobNumber}] ${job.pid}\n`);
    incrementJobCounter();
}

module.exports = {
    handleBackgroundJobs
}