import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize, UUIDV4 } from 'sequelize';
import dbConnection from '../config';
import { compare, hash } from 'bcrypt';

type UserAttributes = {
    id: UUID;
    name: string;
    email: string;
    password: string;
}

export type UserInput = Optional<UserAttributes, 'id'>;

export default class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: UUID;
    public name!: string;
    public email!: string;
    public password!: string;

    checkPassword = async (password: string) => compare(password, this.password);

    toJSON() {
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