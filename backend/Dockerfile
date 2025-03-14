FROM python:3.11-alpine

RUN apk add \
    postgresql-dev \
    gcc \
    musl-dev

ENV PYTHONUNBUFFERED=1
WORKDIR /backend
COPY requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
COPY . .

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:30020"]