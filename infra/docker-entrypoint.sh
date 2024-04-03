poetry run task makemigrations
poetry run task migrate
poetry run task loaddata
poetry run task createdevuser
poetry run task loadpayments
poetry run task collectstatic
poetry run task copystatic
poetry run task start