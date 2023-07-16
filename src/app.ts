import {Telegraf, Scenes, session} from 'telegraf';
import {ConfigService} from "./config/config.service";
import {IConfigService} from "./config/config.interface";
import {TGCommand} from "./middleware/tg-command/tg-command.class";
import {StartCommand} from "./middleware/tg-command/start.command";
import {SendPassword} from "./middleware/tg-command/send-password.command";
import { SetAdmin } from "./middleware/tg-command/set-admin.command";
import {AnyMessage} from "./middleware/tg-command/any-message.command";
import {SaveChannel, SetChannelAdmin} from "./common/sequelize/channel-model.sequelize";
import {ChannelsListCommand} from "./middleware/tg-command/channels-list.command";
import {ChannelsListScene} from "./middleware/tg-command/channels-list.command";
import {BackButtonCommand} from "./middleware/tg-command/back-button.command";
import {CreatePostCommand, CreatePostScene} from "./middleware/tg-command/create-post.command";
import {GetUpdatesCommand} from "./middleware/tg-command/get-updates.command";

interface IRunTelegraf {
	bot: any;
	stage: any
	commands: any;
}

class Bot implements IRunTelegraf {
	stage: any;
	bot: any;
	commands: TGCommand[] = []
	scenes: any
	constructor(private readonly configService: IConfigService) {
		this.bot = new Telegraf (this.configService.get("TELEGRAM_API_TOKEN"));
		this.scenes = [
			new ChannelsListScene(),
			new CreatePostScene(this.bot)
		]
		for (const scene of this.scenes) {
			scene.init()
		}


		this.stage = new Scenes.Stage([this.scenes[0].scene, this.scenes[1].scene])
		this.bot.use(session())
		this.bot.use(this.stage.middleware())
	}


	launch() {
		// let configService = new ConfigService()
		// fetch(`https://api.telegram.org/bot${configService.get("TELEGRAM_API_TOKEN")}/getUpdates`).then((res: any) => res.json()).then((res) => {
		// 	 if (res?.result?.length) {
		// 		 console.log(res, 'res')
		// 		res.result
		// 			.forEach((r: any) => {
		// 			for (const [key, value] of Object.entries(r)) {
		// 				console.log(r, 'r')
		// 				if (key == 'my_chat_member') {
		// 					// @ts-ignore
		// 					let telegramId = value.chat.id
		// 					// @ts-ignore
		// 					let channelName = value.chat.username
		// 					// @ts-ignore
		// 					let channelTitle = value.chat.title || 'anon'
		// 					new SaveChannel(telegramId.toString(), channelTitle.toString(), channelName.toString()).init()
		//
		// 					// @ts-ignore
		// 					if (value.new_chat_member.status == 'administrator') {
		// 						new SetChannelAdmin().init(telegramId, true)
		// 					}
		// 					// @ts-ignore
		// 					if (value.new_chat_member.status == 'left') {
		// 						new SetChannelAdmin().init(telegramId, false)
		// 					}
		// 				}
		//
		// 			}
		// 		})
		// 	} else {
		// 		console.log('empty results')
		// 	 }
		// })

		this.commands = [
			new ChannelsListCommand(this.bot),
			new CreatePostCommand(this.bot),
			new StartCommand(this.bot),
			new GetUpdatesCommand(this.bot),
			new SendPassword(this.bot),
			new SetAdmin(this.bot),
			// new AnyMessage(this.bot),
			new BackButtonCommand(this.bot),
		]
		for (const command of this.commands) {
          command.init()
		}
		this.bot.launch()
	}
}

export const bot = new Bot (new ConfigService());

bot.launch();
