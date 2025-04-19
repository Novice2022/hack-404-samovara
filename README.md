# Как какать

## Клонирование репозитория (пока так)

### Для бэкендеров

``` shell
git clone https://github.com/Novice2022/hack-404-samovara.git

cd hack-404-samovara

git checkout -b dev
git branch --set-upstream-to=origin/dev dev
git pull

git checkout -b backend
git branch --set-upstream-to=origin/backend backend
git pull
```

### Для фронтендеров

``` shell
git clone https://github.com/Novice2022/hack-404-samovara.git

cd hack-404-samovara

git checkout -b dev
git branch --set-upstream-to=origin/dev dev
git pull

git checkout -b frontend
git branch --set-upstream-to=origin/frontend frontend
git pull
```

Затем переносите то, что успели сделать в соответствующую папку (backend или frontend)

## Запуск контейнеров и их установка

Установка контейнеров и запуск:

``` shell
docker compose up -d --build
```

Последующие запуски контейнеров:

``` shell
docker compose up -d
```
