const core = require('@actions/core');
const github = require('@actions/github');

const updateIssue = async () => {
    const tagName = core.getInput("tag_name", { required: true });
    const owner = core.getInput("owner", { required: true });
    const repo = core.getInput("repo", { required: true });
    const testsResult = core.getInput("tests_result", { required: false });
    const testsResultUrl = core.getInput("tests_result_url", { required: false });
    const deployResult = core.getInput("deploy_result", { required: false });
    const deployResultUrl = core.getInput("deploy_result_url", { required: false });

    const octokit = github.getOctokit(core.getInput("github_token", { required: true }));

    const { data: issues } = await octokit.rest.issues.listForRepo({ owner, repo, labels: ["RELEASE"] });

    const issueNumber = issues.find(i => i.title === `RELEASE - ${tagName}`)?.number;

    if (!issueNumber) return;

    if (testsResult) {
        const testObject = JSON.parse(testsResult);
        const commentBody = `# Результат запуска проверок

## Проверка Lint:
${testObject.lint.result === "success" ? "Проверка Lint прошла успешно" : "Проверка Lint завершилась с ошибкой"}

## Запуск Jest тестов:
${testObject["unit-tests"].result === "success" ? "Прогон Jest тестов завершился успешно" : "Прогон Jest тестов завершился с ошибкой"}

## Запуск Playwright тестов:
${testObject["e2e-tests"].result === "success" ? "Прогон Playwright тестов завершился успешно" : "Прогон Playwright тестов завершился с ошибкой"}

(Ссылка на результат)[${testsResultUrl}]`;

        await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: commentBody });
    }

    if (deployResult) {
        const deployObject = JSON.parse(deployResult);
        const commentBody = `# Результат деплоя
${deployObject.deploy.result === "success" ? "Деплой завершился успешно" : "Деплой завершился с ошибкой"}

(Ссылка на результат)[${deployResultUrl}]`;

        await octokit.rest.issues.createComment({ owner, repo, issue_number: issueNumber, body: commentBody });
        await octokit.rest.issues.update({owner, repo, issue_number: issueNumber, state: "closed"});
    }
};

updateIssue();