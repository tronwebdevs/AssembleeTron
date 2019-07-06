const Sequelize = require('sequelize');
const { db_database, db_username, db_password, db_options } = require('../config').sequelize;
const sequelize = new Sequelize(db_database, db_username, db_password, db_options);

const LabClass = sequelize.define('labsClasses', {
    classLabel: {
        type: Sequelize.STRING(32),
        allowNull: false
    },
    labID: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    allowedH1: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowedH2: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowedH3: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    allowedH4: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
}, { timestamps: false });
LabClass.removeAttribute('id');

module.exports = LabClass;