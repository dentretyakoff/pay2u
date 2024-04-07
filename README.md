# Pay2u - сервис подключения подписок

- [Описание](#desc)
- [Описание Backend](#desc-backend)
    - [Стек технологий](#stack-backend)
    - [Запуск всего проекта в контейнерах(локально)](#all-local)
    - [Запуск всего проекта в контейнерах на сервере](#all-local-server)
    - [Команда](#team-backend)
- [Описание Frontend](#desc-frontend)
    - [Стек технологий](#stack-frontend)
    - [Команда](#team-frontend)

## Описание <a id="desc"></a>
Сервис позволяет пользователям следить за своими подписками на развлекательные сервисы. Подписки разбиты на категории для простоты навигации. Пользователь может подключать новые и продлять старые подписки, добавлять понравившееся в избранное. Есть опция учёта расходов и начисленного кэшбека.

url-адрес: https://pay2u.zapto.org/

swagger: https://pay2u.zapto.org/swagger/
для выполнения запросов необходимо авторизоваться под пользователем для разработки из файла `.env`. По умолчанию - `dev_user` `dev_user_password`

redoc: https://pay2u.zapto.org/redoc/

## Описание Backend <a id="desc-backend"></a>

### Стек технологий <a id="stack-backend"></a>
 - Python 3.10
 - Django 4.2
 - Django REST Framework 3.15
 - Pillow 10.2
 - Postgres 13.3
 - Nginx
 - Docker

### Запуск всего проекта в контейнерах(локально) <a id="all-local"></a>
1. Клонируйте репозиторий
```
git clone git@github.com:KiryhaUdmurt/pay2u.git
```
2. Заполните `.env` в корне проекта по примеру `.env.example`
3. Установите Docker
```
sudo apt update
sudo apt install curl
curl -fSL https://get.docker.com -o get-docker.sh
sudo sh ./get-docker.sh
sudo apt-get install docker-compose-plugin
```
4. Запустите проект
```
sudo docker compose -f infra/docker-compose-local-all.yaml up -d --build
```

### Запуск всего проекта в контейнерах на сервере  <a id="all-local-server"></a>
Выполните шаги 1-3 из [Запуск всего проекта в контейнерах(локально)](#all-local)

1. Установите nginx `sudo apt install nginx -y`
2. Скорректируйте конфиг файл `sudo nano /etc/nginx/sites-available/default`
```
server {
        server_name pay2u.zapto.org;
        location / {
                proxy_set_header X-Real-IP $remote_addr;
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header Host $http_host;
                proxy_pass http://127.0.0.1:8000/;
        }
}
```
3. Установите certbot `sudo snap install --classic certbot`
4. Запустите генерацию сертификата `sudo certbot --nginx `
5. Запустите проект
```
sudo docker compose -f infra/docker-compose-all.yaml up -d --build
```

### Команда <a id="team-backend"></a>
[Денис Третьяков](https://github.com/dentretyakoff)
[Иван Павлов](https://github.com/ivnpvl)


## Описание Frontend <a id="desc-frontend"></a>


### Стек технологий <a id="stack-frontend"></a>


### Команда <a id="team-frontend"></a>

