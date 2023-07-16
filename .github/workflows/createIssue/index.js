const core = require('@actions/core');
const github = require('@actions/github');

const createIssue = async () => {
    const octokit = github.getOctokit(core.getInput("github_token", {required: true}));

    const changelog = core.getInput("changelog", {required: true});

    const issueBody = `# Test body
    Test text <br>

    ${changelog.replace('%OA', '\n')}`;

    await octokit.rest.issues.create({
        owner: core.getInput("owner", {required: true}),
        repo: core.getInput("repo", {required: true}),
        title: `RELEASE - ${core.getInput("tag_name", {required: true})}`,
        labels: ["RELEASE"],
        body: issueBody,
    });
};

createIssue();