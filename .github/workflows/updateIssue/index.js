const core = require('@actions/core');
const github = require('@actions/github');

const updateIssue = async () => {
    const tagName = core.getInput("tag_name", { required: true });
    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });
    const testsResult = core.getInput("testsResult", { required: false });

    const octokit = github.getOctokit(core.getInput("github_token", { required: true }));

    const { data: issues } = await octokit.rest.issues.listForRepo({ owner, repo, labels: ["RELEASE"] });

    const issueNumber = issues.find(i => i.title === `RELEASE - ${tagName}`)?.number;

    if (!issueNumber) return;

    if (testsResult) {
        const commentBody = `# Результат запуска проверок

    ${testsResult}
    `;

        await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: commentBody });
    }
};

updateIssue();