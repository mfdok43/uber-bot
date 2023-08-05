import { Telegraf, Scenes, session } from 'telegraf';
import { ConfigService } from './config/config.service';
import { IConfigService } from './config/config.interface';
import { TGCommand } from './middleware/tg-command/tg-command.class';
import { StartCommand } from './middleware/tg-command/start.command';
import { SendPassword } from './middleware/tg-command/send-password.command';
import { SetAdmin } from './middleware/tg-command/set-admin.command';
import { AnyMessage } from './middleware/tg-command/any-message.command';
import { SaveChannel, SetChannelAdmin } from './common/sequelize/channel-model.sequelize';
import { ChannelsListCommand } from './middleware/tg-command/channels-list.command';
import { ChannelsListScene } from './middleware/tg-command/channels-list.command';
import { BackButtonCommand } from './middleware/tg-command/back-button.command';
import { CreatePostCommand, CreatePostScene } from './middleware/tg-command/create-post.command';
import { IBotContext } from './context/interface';
import { Stage } from 'telegraf/typings/scenes';
import { LoggerService } from './logger/logger';
import { IntervalPostingScene } from './middleware/tg-command/interval-posting.command';

class Bot {
	stage: Stage<any>;
	// bot: Telegraf<IBotContext>;
	bot: any;
	commands: TGCommand[] = [];
	scenes: any[];
	constructor(private readonly configService: IConfigService, readonly logger: LoggerService) {
		this.bot = new Telegraf(this.configService.get('TELEGRAM_API_TOKEN'));
		this.scenes = [
			new ChannelsListScene(),
			new CreatePostScene(this.bot, this.configService),
			new IntervalPostingScene(),
		];
		for (const scene of this.scenes) {
			scene.init();
		}
		this.stage = new Scenes.Stage([
			this.scenes[0].scene,
			this.scenes[1].scene,
			this.scenes[2].scene,
		]);
		this.bot.use(session());
		this.bot.use(this.stage.middleware());

		// this.bot.telegram.getWebhookInfo({ offset: -100 }).then((res: any) => console.log(res, 'upd'));

		this.bot.telegram
			.setMyCommands([
				{
					command: 'start',
					description: 'Bot starts',
				},
				{
					command: 'passgen',
					description: 'Gen of pass',
				},
				{
					command: 'setadmin',
					description: 'Set admin',
				},
			])
			.then();
	}

	launch() {
		this.logger.log('Bot starts');
		// bot.telegram.getUpdates()
		// 	.then((update: any) => {
		// 		console.log(update, 'upd');
		// 	});

		// fetch(`https://api.telegram.org/bot${this.configService.get('TELEGRAM_API_TOKEN')}/getUpdates`)
		// 	.then((res: any) => res.json())
		// 	.then((res) => {
		// 		if (res?.result?.length) {
		// 			console.log(res, 'res');
		// 			res.result.forEach((r: any) => {
		// 				for (const [key, value] of Object.entries(r)) {
		// 					if (key == 'my_chat_member') {
		// 						// @ts-ignore
		// 						const telegramId = value.chat.id;
		// 						// @ts-ignore
		// 						const channelName = value.chat.username;
		// 						// @ts-ignore
		// 						const channelTitle = value.chat.title || 'anon';
		// 						new SaveChannel(
		// 							telegramId.toString(),
		// 							channelTitle.toString(),
		// 							channelName.toString(),
		// 						).init();
		//
		// 						// @ts-ignore
		// 						if (value.new_chat_member.status == 'administrator') {
		// 							new SetChannelAdmin().init(telegramId, true);
		// 						}
		// 						// @ts-ignore
		// 						if (value.new_chat_member.status == 'left') {
		// 							new SetChannelAdmin().init(telegramId, false);
		// 						}
		// 					}
		// 				}
		// 			});
		// 		} else {
		// 			console.log('empty results');
		// 		}
		// 	});

		this.commands = [
			new ChannelsListCommand(this.bot),
			new CreatePostCommand(this.bot),
			new StartCommand(this.bot),
			// new GetUpdatesCommand(this.bot),
			new SendPassword(this.bot),
			new SetAdmin(this.bot),
			new AnyMessage(this.bot),
			new BackButtonCommand(this.bot),
		];
		for (const command of this.commands) {
			command.init();
		}
		this.bot.launch();
	}
}

export const bot = new Bot(new ConfigService(), new LoggerService());

bot.launch();