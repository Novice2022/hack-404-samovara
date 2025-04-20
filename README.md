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

## Разворачивание бэка

``` shell
sudo apt update && sudo apt install -y wget
wget https://packages.microsoft.com/config/ubuntu/22.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
rm packages-microsoft-prod.deb

sudo apt update
sudo apt install -y dotnet-sdk-8.0

cd ./backend/Hackaton/

nano Hakaton.csproj  # Заменяем в строке <TargetFramework>net9.0</TargetFramework> версию на 8.0
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 8.0.0
```

Копируем файл `appsettings.json` в папку Hackaton.

``` shell
docker run -d -p 5432:5432 --name my_postgres \
  -e POSTGRES_USER=user \
  -e POSTGRES_PASSWORD=12345 \
  -e POSTGRES_DB=hakaton \
  postgres

dotnet run --urls="http://0.0.0.0:5000"
```
