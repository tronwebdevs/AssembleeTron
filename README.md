## ![Tron Logo](http://www.mercatinolibri.it/system/schools/1_logos_medium.jpg?1356651800)
Website for assemblies at Liceo Scientifico Tron.
#### Install
```
npm install
mkdir config && cd config
vim credentials.js
vim mysql_credentials.js
```
credentials.js format:
```javascript
module.exports = {
    cookieSecret: 'cookie_secret_here',
    adminPassword: 'admin_password_here'
}
```
mysql_credentials.js format:
```javascript
module.exports = {
    database: 'localhost',
    user: 'root',
    password: '',
    database: 'Assemblee'
}
```
