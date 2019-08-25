## Config file

Config file example for the server

```json
{
    "sequelize": {
        "db_database": "database name",
        "db_username": "username",
        "db_password": "password",
        "db_options": {
            "host": "localhost",
            "dialect": "mysql",
            "pool": {
                "max": 100,
                "acquire": 30000,
                "idle": 10000
            },
            "logging": false
        }
    },
    "adminPassword": "admin password"
}
```

## Licensing
Copyright 2019 [TronWeb](https://www.tronweb.it)