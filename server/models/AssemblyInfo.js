const Sequelize = require('sequelize');
const { db_database, db_username, db_password, db_options } = require('../config').sequelize;
const sequelize = new Sequelize(db_database, db_username, db_password, db_options);
const uuid = require('uuid/v4');

const AssemblyInfo = sequelize.define('info', {
    uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        defaultValue: () => uuid(),
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date: {
        type: Sequelize.DATEONLY,
        allowNull: false
    },
    subOpen: {
        type: Sequelize.DATE,
        allowNull: false
    },
    subClose: {
        type: Sequelize.DATE,
        allowNull: false
    }
}, { timestamps: false });
AssemblyInfo.removeAttribute('id');

module.exports = AssemblyInfo;