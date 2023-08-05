import { PostModel } from '../../models/post.model';
import { Db } from '../../connections/db.connection';
import { Model, ModelCtor, Sequelize } from 'sequelize';

export class SavePost {
	name: string;
	text: string;
	photo: string;
	seller: string;
	timer: string;
	db: Sequelize;
	postModel: ModelCtor<Model<any, any>>;
	foundUser: any;

	constructor(name: string, text: string, photo: string, seller: string, timer: string) {
		this.name = name;
		this.text = text;
		this.photo = photo;
		this.seller = seller;
		this.timer = timer;
		this.db = new Db().sequelize;
		this.postModel = new PostModel().postModel;
	}
	init = async () => {
		try {
			const name = this.name;
			const text = this.text;
			const photo = this.photo;
			const seller = this.seller;
			const timer = this.timer;

			await this.postModel.sync();
			await this.postModel.create({
				name: name,
				text: text,
				photo: photo,
				seller: seller,
				timer: timer,
			});
		} catch (e) {
			console.log(e);
		}
	};
}

export class DeletePost {
	postModel: any;
	constructor() {
		this.postModel = new PostModel().postModel;
	}
	init(name: any) {
		try {
			return this.postModel.destroy({ where: { name: name } });
		} catch (e) {
			console.log(e);
		}
	}
}

export class GetPosts {
	getPosts: any;
	postModel: any;
	constructor() {
		this.postModel = new PostModel().postModel;
	}
	async init() {
		try {
			await this.postModel.findAll({ raw: true }).then((res: any) => (this.getPosts = res));
			return this.getPosts;
		} catch (e) {
			console.log(e);
		}
	}
}
export class GetPost {
	postModel: any;
	constructor() {
		this.postModel = new PostModel().postModel;
	}
	init(name: any) {
		try {
			return this.postModel.findOne({ where: { name: name } });
		} catch (e) {
			console.log(e);
		}
	}
}
