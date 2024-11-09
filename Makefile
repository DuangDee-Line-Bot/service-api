start:
	python -m run

dev:
	uvicorn main:app --reload

install:
	pip install -U -r requirements.txt
	pip install -U -r requirements-dev.txt

test:
	pytest

format:
	black .
	docformatter -i -r .
	ruff check --fix .

freeze:
	pip freeze > requirements.txt

migrate:
	alembic upgrade head

downgrade:
	alembic downgrade base

client-init:
	openapi-python-client generate --path docs/openapi.json

client:
	openapi-python-client update --path docs/openapi.json

pip-compile:
	pip-compile

pip-compile-u:
	pip-compile -U
