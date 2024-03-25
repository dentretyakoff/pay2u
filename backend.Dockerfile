FROM python:3.10

RUN pip install poetry==1.8.2

COPY ./backend /app/backend
COPY poetry.lock pyproject.toml /app/

WORKDIR /app
RUN poetry config virtualenvs.create false && \
    poetry install --no-dev --no-interaction --no-ansi

COPY ./infra/docker-entrypoint.sh /app/

RUN chmod +x /app/docker-entrypoint.sh