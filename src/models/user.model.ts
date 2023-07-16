import { Db } from '../connections/db.connection';
import {DataTypes, ModelCtor, Model, Sequelize} from 'sequelize';


export class UserModel {
	db: Sequelize
	userModel: ModelCtor<Model<any, any>>
	constructor() {
		this.db = new Db().sequelize
		this.userModel = this.db.define(
			'user',
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
					unique: true,
					allowNull: false,
				},
				login: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: false,
				},
				username: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: true,
				},
				privileged: {
					type: DataTypes.BOOLEAN,
					defaultValue: false,
					allowNull: true,
				},
				seller: {
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