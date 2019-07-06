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

## File Structure

```
AssembleeTron
.
├── client
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   ├── public
│   │   ├── index.html
│   │   └── tw-logo.png
│   ├── src
│   │   ├── actions
│   │   │   ├── adminActions.js
│   │   │   ├── assemblyActions.js
│   │   │   ├── studentActions.js
│   │   │   └── types.js
│   │   ├── components
│   │   │   ├── Admin
│   │   │   │   └── SiteWrapper
│   │   │   │       ├── AccountDropdown.js
│   │   │   │       ├── c3jscustom.css
│   │   │   │       ├── index.js
│   │   │   │       └── NavBarItems.js
│   │   │   ├── App
│   │   │   │   ├── index.css
│   │   │   │   └── index.js
│   │   │   ├── FormCard
│   │   │   │   ├── index.css
│   │   │   │   └── index.js
│   │   │   ├── pages
│   │   │   │   ├── Admin
│   │   │   │   │   ├── Dashboard.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── Login.js
│   │   │   │   └── Student
│   │   │   │       ├── Home.js
│   │   │   │       ├── index.js
│   │   │   │       ├── LabsSelect.js
│   │   │   │       └── ShowSub.js
│   │   │   ├── StandaloneFormPage
│   │   │   │   └── index.js
│   │   │   └── Student
│   │   │       ├── Badge.js
│   │   │       ├── ErrorAlert.js
│   │   │       ├── index.js
│   │   │       ├── InfoBox.js
│   │   │       ├── LabShow.js
│   │   │       ├── LabsSelectorForm
│   │   │       │   ├── index.js
│   │   │       │   └── LabSelector
│   │   │       │       ├── DefaultOption.js
│   │   │       │       ├── index.js
│   │   │       │       └── Option.js
│   │   │       ├── LabsTable.js
│   │   │       ├── LoginCard.js
│   │   │       ├── LoginFormCard
│   │   │       │   ├── index.js
│   │   │       │   └── LoginForm.js
│   │   │       ├── NotPartCard.js
│   │   │       └── SiteWrapper
│   │   │           ├── index.css
│   │   │           └── index.js
│   │   ├── index.js
│   │   ├── reducers
│   │   │   ├── adminReducer.js
│   │   │   ├── assemblyReducer.js
│   │   │   ├── index.js
│   │   │   └── studentReducer.js
│   │   └── store.js
│   └── yarn.lock
└── server
    ├── app.js
    ├── .gitignore
    ├── models
    │   ├── AssemblyInfo.js
    │   ├── LabClass.js
    │   ├── Lab.js
    │   ├── Student.js
    │   └── Sub.js
    ├── package.json
    ├── package-lock.json
    └── routes
        ├── admins.js
        ├── assembly.js
        └── students.js
```

## Licensing
Copyright 2019 [TronWeb](https://www.tronweb.it)