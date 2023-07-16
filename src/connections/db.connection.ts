import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

export class Db {
	sequelize: Sequelize
	constructor() {
		let database: any = process.env.POSTGRES_DATABASE;
		let username: any = process.env.POSTGRES_USERNAME;
		let password: any = process.env.POSTGRES_PASSWORD;

		let host: any = process.env.POSTGRES_HOST;
		let port: any = process.env.POSTGRES_PORT;
		let dialect: any = process.env.POSTGRES_DIALECT;
		this.sequelize = new Sequelize(database, username, password, {
			host,
			port,
			dialect,
		})
	}
};
