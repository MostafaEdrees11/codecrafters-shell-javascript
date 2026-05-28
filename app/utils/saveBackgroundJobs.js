const { jobsList } = require("../built-in-commands/jobs");

const saveBackgroundJobs = ({ job_number, process_id, command, status }) => {
    jobsList.push({ job_number, process_id, command, status });
};

module.exports = {
    saveBackgroundJobs
};