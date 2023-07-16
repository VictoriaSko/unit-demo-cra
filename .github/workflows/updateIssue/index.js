const core = require('@actions/core');
const github = require('@actions/github');

const updateIssue = async () => {
    const tagName = core.getInput("tag_name", { required: true });
    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });
    const testsResult = core.getInput("tests_result", { required: false });
    const testsResultUrl = core.getInput("tests_result_url", { required: false });

    const octokit = github.getOctokit(core.getInput("github_token", { required: true }));

    const { data: issues } = await octokit.rest.issues.listForRepo({ owner, repo, labels: ["RELEASE"] });

    const issueNumber = issues.find(i => i.title === `RELEASE - ${tagName}`)?.number;

    if (!issueNumber) return;

    if (testsResult) {
        const testObject = JSON.parse(testsResult);
        const commentBody = `# Результат запуска проверок

        ## Проверка Lint:
        ${testObject.lint.result}

        ## Запуск Jest тестов:
        ${testObject["unit-tests"].result}

        ## Запуск Playwright тестов:
        ${testObject["e2e-tests"].result}

        ## Ссылка на результат:
        ${testsResultUrl}
    `;

        await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: commentBody });
    }
};

updateIssue();