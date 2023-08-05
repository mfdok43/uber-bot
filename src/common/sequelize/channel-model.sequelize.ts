import { Model, ModelCtor, Sequelize } from 'sequelize';
import { Db } from '../../connections/db.connection';
import { ChannelModel } from '../../models/channel.model';

export class SaveChannel {
	telegramId: string;
	channelName: string;
	channelTitle: string;
	db: Sequelize;
	channelModel: ModelCtor<Model<any, any>>;

	foundChannel: any;

	constructor(telegramId: string, channelName: string, channelTitle: string) {
		this.telegramId = telegramId;
		this.channelName = channelName;
		this.channelTitle = channelTitle;
		this.db = new Db().sequelize;
		this.channelModel = new ChannelModel().channelModel;
	}
	init = async () => {
		try {
			const telegramId = this.telegramId;
			const channelName = this.channelName;
			const channelTitle = this.channelTitle;

			await this.channelModel.sync();
			this.foundChannel = await this.channelModel
				.findOne({ where: { telegramId } })
				.then((res: any) => {
					if (res != null) {
						console.log('chanel is here');
						if (res.channelTitle !== this.channelTitle) {
							this.channelModel.update({ channelTitle }, { where: { telegramId } });
						}
					} else {
						this.channelModel.create({
							telegramId: telegramId,
							channelName: channelName,
							channelTitle: channelTitle,
						});
					}
				});
		} catch (e) {
			console.log(e);
		}
	};
}

export class GetChannels {
	getChannels: any;
	channelModel: any;
	constructor() {
		this.channelModel = new ChannelModel().channelModel;
		this.getChannels = this.channelModel.findAll({ raw: true }).then((res: any) => res);
	}
}
export class GetChannel {
	channelModel: any;
	constructor() {
		this.channelModel = new ChannelModel().channelModel;
	}
	init(telegramId: any) {
		try {
			return this.channelModel.findOne({ where: { telegramId: telegramId } });
		} catch (e) {
			console.log(e);
		}
	}
}

export class GetChannelsByAdmin {
	channels: any;
	channelModel: any;
	constructor() {
		this.channelModel = new ChannelModel().channelModel;
	}
	async init(value = false) {
		try {
			this.channels = await this.channelModel
				.findAll({
					raw: true,
					where: { isAdmin: value },
				})
				.then((res: any) => console.log(res));
			return this.channels;
		} catch (e: any) {
			console.log(e);
		}
	}
}
export class SetChannelAdmin {
	channelModel: any;
	constructor() {
		this.channelModel = new ChannelModel().channelModel;
	}

	init(telegramId: string, value: boolean) {
		return this.channelModel.update({ isAdmin: value }, { where: { telegramId: telegramId } });
	}
}
