Website for assemblies at Liceo Scientifico Tron.
#### Install
```
npm install
mkdir config && cd config
vim config.json
```
config.json format:
```json
{
    "mysqlCredentials": {
        "host": "localhost",
        "user": "username",
        "password": "user_password",
        "database": "database_name"
    },
    "cookieSecret": "cookie secret",
    "adminPassword": "admin passowrd"
}
```
