/** @module db/models/User */

import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize, UUIDV4 } from 'sequelize';
import dbConnection from '../config';
import { compare, hash } from 'bcrypt';

interface UserAttributes {
    id: UUID;
    name: string;
    email: string;
    password: string;
}

export type UserInput = Optional<UserAttributes, 'id'>;

/**
 * The User model
 * @extends Model
 * @implements {UserAttributes}
 */
export default class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: UUID;
    public name!: string;
    public email!: string;
    public password!: string;

    /**
     * Checks the given password against the user instance password.
     * @async
     * @param {string} password
     * @returns {Promise.<boolean>} true if the passwords match, false if not
     */
    checkPassword = async (password: string): Promise<boolean> => compare(password, this.password);

    /**
     * Returns a JSON-serializable object containing user data from the instance.
     * @override
     * @returns { Omit.<UserAttributes, 'password'> }
     */
    toJSON(): Omit<UserAttributes, 'password'> {
        const { password, ...data } = this.dataValues;
        return data;
    }
}

User.init({
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: UUIDV4
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [6, 255],
            isAlphanumeric: true
        }
    }
}, {
    timestamps: false,
    sequelize: dbConnection,
    tableName: 'users',
    underscored: true,
    hooks: {
        beforeCreate: (async user => {
            user.password = await hash(user.password, 10);
        }),
        beforeUpdate: (async (user, options) => {
            if (user.changed('password')) {
                options.validate = false;
                user.password = await hash(user.password, 10);
            }
        })
    }
});