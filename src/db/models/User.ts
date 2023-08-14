import { UUID } from 'crypto';
import { DataTypes, Model, Optional, Sequelize, UUIDV4 } from 'sequelize';
import dbConnection from '../config';
import { compare, hash } from 'bcrypt';

type UserAttributes = {
    id: UUID;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserInput = Optional<UserAttributes, 'id'>;
// export type UserOutput = Required<UserAttributes>;

export default class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: UUID;
    public name!: string;
    public email!: string;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    async checkPassword(password: string) {
        return compare(password, this.password);
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
    underscored: true
});

User.beforeCreate(async (user, options) => {
    user.password = await hash(user.password, 10);
});