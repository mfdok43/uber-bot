import dotenv from 'dotenv';
dotenv.config();

import { Sequelize } from 'sequelize';

export class Db {
	sequelize: Sequelize;
	constructor() {
		const database: any = process.env.POSTGRES_DATABASE;
		const username: any = process.env.POSTGRES_USERNAME;
		const password: any = process.env.POSTGRES_PASSWORD;

		const host: any = process.env.POSTGRES_HOST;
		const port: any = process.env.POSTGRES_PORT;
		const dialect: any = process.env.POSTGRES_DIALECT;
		this.sequelize = new Sequelize(database, username, password, {
			host,
			port,
			dialect,
		});
	}
}
