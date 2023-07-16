import { Db } from '../connections/db.connection';
import {DataTypes, ModelCtor, Model, Sequelize} from 'sequelize';


export class ChannelModel {
    db: Sequelize
    channelModel: ModelCtor<Model<any, any>>
    constructor() {
        this.db = new Db().sequelize
        this.channelModel = this.db.define(
            'channel',
            {
                id: {
                    type: DataTypes.UUID,
                    defaultValue: DataTypes.UUIDV4,
                    primaryKey: true,
                    unique: true,
                    allowNull: false,
                },
                telegramId: {
                    type: DataTypes.STRING,
                    defaultValue: false,
                    allowNull: false,
                },
                channelTitle: {
                    type: DataTypes.STRING,
                    defaultValue: false,
                    allowNull: true,
                },
                channelName: {
                    type: DataTypes.STRING,
                    defaultValue: false,
                    allowNull: true,
                },
                vip: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: true,
                },
                isAdmin: {
                    type: DataTypes.BOOLEAN,
                    defaultValue: false,
                    allowNull: true,
                },
            },

            {
                timestamps: true,
                updatedAt: false,
            },
        );

    }
}
