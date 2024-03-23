# Запуск бэкенда для разработки
- прописать параметры в файле `.env`, для примера можно взять из `.env.example`
## Для запуска всего бэка в контейнерах
```
docker compose -f infra/docker-compose-local.yaml up -d --build
```

## Для запуска только БД в контейнер
- установить poetry
    ```
    pip install poetry
    ```
- установить зависимости
    ```
    poetry install
    ```
- активировать окружение
    ```
    poetry shell
    ```
- запустить БД
    ```
    poetry run task onlydb
    ```
- запустить проект
    ```
    python backend/manage.py runserver
    ```