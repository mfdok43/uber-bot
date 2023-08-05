import { TGCommand } from './tg-command.class';
import { Scenes } from 'telegraf';
import {
	BackButton,
	CreatePostButton,
	ChannelsMenu,
	SelectAllButton,
	IntervalPostingButton,
} from './markup.buttons';
import {
	GetChannel,
	SaveChannel,
	SetChannelAdmin,
} from '../../common/sequelize/channel-model.sequelize';
import { IConfigService } from '../../config/config.interface';
import { UpdateType } from 'telegraf/typings/telegram-types';
import { SavePost } from '../../common/sequelize/post-model.sequelize';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CronJob = require('cron').CronJob;

const setSmile = (obj: any, smile: any) => {
	console.log(obj);
	obj = smile;
	console.log(obj);
};

export class CreatePostScene extends TGCommand {
	scene: any;
	channelsButtons: any;
	backButton: any;
	createPostButton: any;
	selectAllButton: any;
	intervalPostingButton: any;
	replyMarkup: any;
	constructor(bot: any, private readonly configService: IConfigService) {
		super(bot);
		this.scene = new Scenes.BaseScene('createPost');
	}

	init() {
		console.log('scene init');
		this.scene.enter(async (ctx: any) => {
			const session = ctx.scene.session;
			// ctx.deleteMessage(ctx.update.callback_query.message.message_id.toString());
			session.isText = `❌`;
			session.isLink = `❌`;
			session.isPhoto = `❌`;
			session.selectedChannelsList = [];
			session.replyText = `Create post scene. Commands dont work!. \nPost content: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`;
			console.log('enter');
			this.channelsButtons = await new ChannelsMenu().buttonsMarkup().then((res: any) => res);

			this.backButton = new BackButton().markup;
			this.selectAllButton = new SelectAllButton().markup;
			this.createPostButton = new CreatePostButton().markup;
			this.intervalPostingButton = new IntervalPostingButton().markup;
			this.replyMarkup = {
				reply_markup: {
					inline_keyboard: [
						...this.channelsButtons,
						this.selectAllButton,
						this.createPostButton,
						this.intervalPostingButton,
						this.backButton,
					],
				},
			};

			await ctx.replyWithHTML(session.replyText, this.replyMarkup);

			session.msgId = ctx.message_id;
			// console.log(ctx.update.callback_query.message.message_id, 'idd');
		});

		this.scene.action(/-100/, (ctx: any) => {
			const session = ctx.scene.session;
			try {
				new GetChannel().init(ctx.match.input).then((res: any) => {
					session.dataValues = res.dataValues;
					if (session.selectedChannelsList.length > 0) {
						session.channelIndex = session.selectedChannelsList.findIndex(
							(c: any) => c.callback_data == ctx.match.input,
						);
						if (session.channelIndex != -1) {
							session.selectedChannelsList.splice(session.channelIndex, 1);
						} else {
							session.selectedChannelsList.push({
								text: res.dataValues.channelName,
								callback_data: res.dataValues.telegramId,
							});
						}
					} else {
						session.selectedChannelsList.push({
							text: res.dataValues.channelName,
							callback_data: res.dataValues.telegramId,
						});
					}
					console.log(session.selectedChannelsList, 'listt');
				});
			} catch (e) {
				console.log(e);
			}
		});

		this.scene.action('intervalPosting', (ctx: any) => {
			const session = ctx.scene.session;
			new SavePost(
				session.messageText.substring(0, 15),
				session.messageText,
				session.photoId ||
					'https://upload.wikimedia.org/wikipedia/commons/2/24/Velyki-Hai-Nashi-Hai-15057967.jpg',
				session.lik || 't.me/mfdok43',
				session.timer || '12:00',
			).init();
			ctx.scene.enter('intervalPosting');
			console.log('scene intPosting enter');
			// cron.schedule('*/1 * * * * *', () => {
			//     console.log('running every minute 1, 2, 4 and 5');
			// });

			// const task = new CronJob({
			// 	cronTime: '*/1 * * * * *',
			// 	onTick: () => {
			// 		console.log('tick');
			// 	},
			// 	onComplete: () => console.log('complete'),
			// });
			//
			// task.start();
			// task.stop();
		});

		this.scene.action('selectAll', async (ctx: any) => {
			const session = ctx.scene.session;

			try {
				session.selectedChannelsList = [];
				this.channelsButtons.forEach((c: any) => {
					c.forEach((c: any) => session.selectedChannelsList.push(c));
				});
				console.log(session.selectedChannelsList, 'channels');
			} catch (e) {
				console.log(e);
			}
		});

		this.scene.on('photo', (ctx: any) => {
			const session = ctx.scene.session;

			// ctx.deleteMessage(ctx.update.callback_query.message.message_id.toString());
			console.log(ctx.message.photo[0], 'photo');
			session.photoId = ctx.message.photo[0].file_id;
			session.isPhoto = `✔️`;
			session.replyText = `Create post scene. Commands dont work!. \nPost content: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`;
			ctx.replyWithHTML(ctx.scene.session.replyText, this.replyMarkup);
		});

		this.scene.hears(/t.me/, (ctx: any) => {
			const session = ctx.scene.session;
			session.link = ctx.message.text;
			session.isLink = `✔️`;
			session.replyText = `Create post scene. Commands dont work!. \nPost content: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`;
			ctx.replyWithHTML(ctx.scene.session.replyText, this.replyMarkup);
			console.log(session.link, 'link saved');
		});

		this.scene.hears(/(([2][0-3])|([0-1][0-9])):([0-5][0-9])/, (ctx: any) => {
			console.log(ctx.message.text, 'vremia');
		});

		this.scene.on('message', async (ctx: any) => {
			const session = ctx.scene.session;
			// ctx.deleteMessage(ctx.update.callback_query.message.message_id.toString());
			this.channelsButtons = await new ChannelsMenu().buttonsMarkup().then((res: any) => res);
			session.messageText = ctx.message.text;
			session.isText = `✔️`;
			session.replyText = `Create post scene. Commands dont work!. \nPost content: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`;
			await ctx.replyWithHTML(session.replyText, this.replyMarkup);
			console.log(ctx.message.text, ctx.scene.session.messageText, '1=1');
		});



		this.scene.action('createPost', (ctx: any) => {
			const session = ctx.scene.session;
			const data = JSON.stringify({
				caption: session.messageText,
				photo:
					session.photoId?.toString() ||
					'https://upload.wikimedia.org/wikipedia/commons/2/24/Velyki-Hai-Nashi-Hai-15057967.jpg',
				reply_markup: {
					inline_keyboard: [[{ text: 'Connect with seller', url: session.link || `t.me/mfdok43` }]],
				},
			});

			if (session.selectedChannelsList.length == 0) {
				ctx.reply('Enter at least 1 channel');
			} else if (session.selectedChannelsList.length == 1) {
				fetch(
					`https://api.telegram.org/bot${this.configService.get(
						'TELEGRAM_API_TOKEN',
					)}/sendPhoto?chat_id=${session.selectedChannelsList[0].callback_data}`,
					{
						method: 'POST',
						headers: {
							Connection: 'close',
							'Content-Type': 'application/json',
						},
						body: data,
					},
				)
					.then((res) => res.json())
					.then((res) => console.log(res));
			} else {
				session.selectedChannelsList.forEach((s: any) => {
					fetch(
						`https://api.telegram.org/bot${this.configService.get(
							'TELEGRAM_API_TOKEN',
						)}/sendPhoto?chat_id=${s.callback_data}`,
						{
							method: 'POST',
							headers: {
								Connection: 'close',
								'Content-Type': 'application/json',
							},
							body: data,
						},
					)
						.then((res) => res.json())
						.then((res) => console.log(res));
				});
			}
		});
	}
}
export class CreatePostCommand extends TGCommand {
	scene: any;
	constructor(bot: any) {
		super(bot);
	}
	init() {
		try {
			this.bot.action('createPost', async (ctx: any) => {
				await ctx.scene.enter('createPost');
			});
		} catch (e) {
			console.log(e);
		}
	}
}
