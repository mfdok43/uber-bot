import { Db } from '../connections/db.connection';
import { DataTypes, ModelCtor, Model, Sequelize } from 'sequelize';

export class PostModel {
	db: Sequelize;
	postModel: ModelCtor<Model<any, any>>;
	constructor() {
		this.db = new Db().sequelize;
		this.postModel = this.db.define(
			'post',
			{
				id: {
					type: DataTypes.UUID,
					defaultValue: DataTypes.UUIDV4,
					primaryKey: true,
					unique: true,
					allowNull: false,
				},
				name: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: false,
				},
				text: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: false,
				},
				photo: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: true,
				},
				seller: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: true,
				},
				timer: {
					type: DataTypes.STRING,
					defaultValue: false,
					allowNull: false,
				},
			},
			{
				timestamps: true,
				updatedAt: false,
			},
		);
	}
}
