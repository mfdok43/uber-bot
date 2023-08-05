import { UserModel } from '../../models/user.model';
import { Db } from '../../connections/db.connection';
import { Model, ModelCtor, Sequelize } from 'sequelize';

export class SaveUser {
	login: string;
	username: string;
	db: Sequelize;
	userModel: ModelCtor<Model<any, any>>;

	foundUser: any;

	constructor(login: string, username: string) {
		this.login = login;
		this.username = username;
		this.db = new Db().sequelize;
		this.userModel = new UserModel().userModel;
	}
	init = async () => {
		try {
			const login = this.login;
			const username = this.username;

			await this.userModel.sync();
			this.foundUser = await this.userModel.findOne({ where: { login } }).then((res: any) => {
				if (res != null) {
					console.log('user is here');
					if (res.username !== this.username) {
						this.userModel.update({ username }, { where: { login } });
					}
				} else {
					console.log('new user');
					this.userModel.create({ login: login, username: username });
				}
			});
		} catch (e) {
			console.log(e);
		}
	};
}
export class GetUsers {
	getUsers: any;
	userModel: any;
	constructor() {
		this.userModel = new UserModel().userModel;
	}
	async init() {
		try {
			await this.userModel.findAll({ raw: true }).then((res: any) => (this.getUsers = res));
			console.log(this.getUsers[0].id, 'get 1');
			return this.getUsers;
		} catch (e) {
			console.log(e);
		}
	}
}
export class GetUser {
	userModel: any;
	constructor() {
		this.userModel = new UserModel().userModel;
	}
	init(login: any) {
		try {
			return this.userModel.findOne({ where: { login: login } });
		} catch (e) {
			console.log(e);
		}
	}
}
export class GetUsersByPrivileged {
	users: any;
	userModel: any;
	constructor() {
		this.userModel = new UserModel().userModel;
	}
	async init(value = false) {
		try {
			this.users = await this.userModel
				.findAll({
					raw: true,
					where: { privileged: value },
				})
				.then((res: any) => console.log(res));
			return this.users;
		} catch (e: any) {
			console.log(e);
		}
	}
}

export class GetUsersBySeller {
	users: any;
	userModel: any;
	constructor() {
		this.userModel = new UserModel().userModel;
	}
	async init(value = false) {
		try {
			this.users = await this.userModel
				.findAll({
					raw: true,
					where: { seller: value },
				})
				.then((res: any) => console.log(res));
			return this.users;
		} catch (e: any) {
			console.log(e);
		}
	}
}
export class SetPrivilegedUser {
	userModel: any;
	constructor() {
		this.userModel = new UserModel().userModel;
	}

	init(login: string, value: boolean) {
		return this.userModel.update({ privileged: value }, { where: { login: login } });
	}
}
