### ДЗ "Инфраструктура"

## Задание 1
Для появления ошибки при несоответствии сообщения коммита формату conventional commits был использован commitlint<br/>

**Проверка форматирования в пре-коммитах:**
```sh
# установить зависимости
npm ci

# Активация пре-коммит хуков
npx husky install

# Если пре-коммит хук был пропущен
chmod ug+x .husky/*
chmod ug+x .git/hooks/*

#Тест пре-коммита, который выдаст ошибку
git commit -m "foo: this will fail"

#Тест пре-коммита, который пройдет проверку
git commit -m "chore: lint on commitmsg"
```

**Проверка форматирования коммитов, реализованная с помощью GitHub Actions:**<br/>

Для проверки был добавлен файл `.github/workflows/commit-lint.yml`. При пуше коммита запускается задача `commitlint`, которая делает следующее:
1. Настраивает окружение, в котором будет происходить проверка
2. Проверяется сообщение коммита
3. Если проверка не проходит - задача падает

В разделе Actions репозитория можно посмотреть [успешные задачи]() для правильного сообщения коммита и [проваленные задачи]()

- [.yml файл для проверки форматирования коммитов](https://github.com/VictoriaSko/unit-demo-cra/blob/main/.github/workflows/commit-lint.yml)

-------------

## Задание 2

В GitHub Actions были реализованы задачи для запуска unit и e2e тестов, а так же запуск eslint проверки, при пуше коммита в пул реквест <br>

В разделе Pull requests можно посмотреть пример [успешных запусков тестов](https://github.com/VictoriaSko/unit-demo-cra/pull/5) и [проваленных запусков тестов](https://github.com/VictoriaSko/unit-demo-cra/pull/6)

Описание работы задач:
1. Устанавливаются зависимости и настраивается окружение, на котором будет проводится проверка
2. Запускается соответствующий (test, e2e, lint) npm скрипт, прописанный в package.json
3. Если проверка не проходит (в случае тестов, если хотя бы один из тестов завершается с ошибкой) - задача падает

- [.yml файл для eslint проверки, для unit тестов, для e2e тестов](https://github.com/VictoriaSko/unit-demo-cra/blob/main/.github/workflows/pr-checks.yml)

-------------

## Задание 3

Пример процесса релиза можно посмотреть на основе обновления v26 (ниже версии v26 были тестовые релизы, необходимые для выполнения задачи, их результаты смотреть не стоит):<br>
* [Релиз v26](https://github.com/VictoriaSko/unit-demo-cra/releases/tag/v26)
* [Workflow релиза v26](https://github.com/VictoriaSko/unit-demo-cra/actions/runs/5569427009)
* [Issue релиза v26](https://github.com/VictoriaSko/unit-demo-cra/issues/36)

Процесс релиза проходит следующие этапы:
1. В ветку main отправляется новый тег
```sh
# Создание локально нового тега
git tag -a v1 -m 'release v1' 

# Загрузка созданного локально тега в репозиторий
git push origin v1
```

2. После загрузки нового тега, соответствующего маске v<число>, в репозиторий, запускается воркфлоу, описанный в файле `./workflows/release.yml` (`on push tags`)

3. Для начала запускается создание релиза (`create-release job`)

4. Создается issue (`create-issue job`)
    - В issue записывается changelog, который представляет из себя список коммитов, запушенных между предыдущей версией тега и текущей
    - Записывается основная информация о релизе (автор, время создания, версия)

5. Запускается проверка Eslint (`lint job`)

6. Запускаются unit и e2e тесты (`unit-tests job и e2e-tests job`)

7. Производится обработка результатов проверки и тестов. Результат записывается в комментарии открытого issue, с указанием ссылки на workflow, в котором производилась проверка, где можно детальнее посмотреть результат проверок (`tests-result job`)

8. Выполнение задач останавливается и продолжится только после подтверждения пользователя.

9. Далее запускается сборка проекта (`build job`)

10. После завершения сборки запускается деплой сайта на github-pages. В случае успешного завершения задачи, проект будет доступен по адресу https://victoriasko.github.io/unit-demo-cra (`deploy job`)

11. После завершения завершения деплоя, запускается обработка результатов, которые добавляются в комментарии открытого issue. Если деплой завершился успешно - issue закрывается (`deploy-result`)

В релизном флоу задачи взаимосвязаны, то есть некоторые задачи ожидают завершения других перед началом. Получается следующая взаимосвязь:

```sh
create-release -> 
create-issue -> 
lint, unit-tests, e2e-tests -> 
tests-result -> 
ожидание подтверждения запуска -> 
build -> 
deploy -> 
deploy-result
```

- [.yml файл для реализации процесса релиза](https://github.com/VictoriaSko/unit-demo-cra/blob/main/.github/workflows/release.yml)