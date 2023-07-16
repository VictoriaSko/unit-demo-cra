const core = require('@actions/core');
const github = require('@actions/github');

const createIssue = async () => {
    const octokit = github.getOctokit(core.getInput("github_token", {required: true}));

    await octokit.rest.issues.create({
        owner: core.getInput("owner", {required: true}),
        repo: core.getInput("repo", {required: true}),
        title: `RELEASE - ${core.getInput("tag_name", {required: true})}`,
        labels: ["RELEASE"],
        body: "#Test body\n*Test text*",
    });
};

createIssue();