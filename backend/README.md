# Запуск бэкенда для разработки
- прописать параметры в файле `.env`, для примера можно взять из `.env.example`
- установить poetry
    ```
    pip install poetry
    ```
- установить зависимости
    ```
    poetry install
    ```
- запустить БД
    ```
    poetry run task onlydb
    ```
- запустить проект
    ```
    python backend/manage.py runserver
    ```