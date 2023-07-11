### ДЗ "Инфраструктура"

## Задание 1
Для появления ошибки при несоответствии сообщения коммита формату conventional commits был использован commitlint<br/>

**Проверка форматирования в пре-коммитах:**
```sh
# установить зависимости
npm ci

# Активация пре-коммит хуков
npx husky install

#Тест пре-коммита, который выдаст ошибку
git commit -m "foo: this will fail"

#Тест пре-коммита, который пройдет проверку
git commit -m "chore: lint on commitmsg"
```

**Проверка форматирования коммитов, в том числе в пул реквестах:**<br/>
Для проверки был добавлен файл `.github/workflows/commit-lint.yml`. При пуше коммита в ветку напрямую или в рамках пул реквеста запускается задача `commitlint`, которая делает следующее:
1. Настраивает окружение, в котором будет происходить проверка
2. В зависимости от типа события происходят 2 типа проверок - для одиночного коммита проверяется его сообщение, для коммита в пул реквесте дополнительно проверяются все коммиты PR на соответствие формату
3. Если одна из проверок не проходит - задача падает

В разделе Actions репозитория можно посмотреть [успешные задачи](https://github.com/VictoriaSko/unit-demo-cra/actions/runs/5524885565) для правильного сообщения коммита и [проваленные задачи](https://github.com/VictoriaSko/unit-demo-cra/actions/runs/5524885969)

-------------

В этом репозитории находится пример приложения с тестами:

- [e2e тесты](e2e/example.spec.ts)
- [unit тесты](src/example.test.tsx)

Для запуска примеров необходимо установить [NodeJS](https://nodejs.org/en/download/) 16 или выше.

Как запустить:

```sh
# установить зависимости
npm ci

# запустить приложение
npm start
```

Как запустить e2e тесты:

```sh
# скачать браузеры
npx playwright install

# запустить тесты
npm run e2e
```

Как запустить модульные тесты:

```sh
npm test
```
