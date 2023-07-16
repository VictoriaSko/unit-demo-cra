const core = require('@actions/core');
const github = require('@actions/github');

const createIssue = async () => {
    const tagName = core.getInput("tag_name", { required: true });
    const actor = core.getInput("actor", { required: true });
    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });

    const octokit = github.getOctokit(core.getInput("github_token", { required: true }));

    const release = await octokit.rest.repos.getReleaseByTag({
        owner,
        repo,
        tag: tagName,
    });

    const changelog = core.getInput("changelog", { required: false }) || "";

    const formattedChangelog = changelog ? `## Changelog
${changelog.replaceAll('%OA', '\n')}
    ` : "";

    const issueBody = `# Релиз ${tagName}
Дата релиза: ${release.created_at}
Автор релиза: ${actor}
Версия релиза: ${tagName}

${formattedChangelog}
`;

    await octokit.rest.issues.create({
        owner, 
        repo: core.getInput("repo", { required: true }),
        title: `RELEASE - ${tagName}`,
        labels: ["RELEASE"],
        body: issueBody,
    });
};

createIssue();