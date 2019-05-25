const Sequelize = require('sequelize');
const { db_database, db_username, db_password, db_options } = require('../config');
const sequelize = new Sequelize(db_database, db_username, db_password, db_options);

const Sub = sequelize.define('subscribers', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    h1: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    h2: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    h3: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
    h4: {
        type: Sequelize.SMALLINT,
        allowNull: false
    },
});
Sub.removeAttribute('id');

module.exports = Sub;