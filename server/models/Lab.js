const Sequelize = require('sequelize');
const { db_database, db_username, db_password, db_options } = require('../config');
const sequelize = new Sequelize(db_database, db_username, db_password, db_options);

const Lab = sequelize.define('labs', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    room: {
        type: Sequelize.STRING(64),
        allowNull: false
    },
    seatsH1: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seatsH2: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seatsH3: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    seatsH4: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    lastsTwoH: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    } 
}, { timestamps: false });

module.exports = Lab;