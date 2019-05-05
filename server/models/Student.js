const Sequelize = require('sequelize');
const { db_database, db_username, db_password, db_options } = require('../config');
const sequelize = new Sequelize(db_database, db_username, db_password, db_options);

const Student = sequelize.define('students', {
    ID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    surname: {
        type: Sequelize.STRING,
        allowNull: false
    },
    classLabel: {
        type: Sequelize.STRING(32),
        allowNull: false
    }
}, { timestamps: false });
Student.removeAttribute('id');

module.exports = Student;