import { BackButton, ChannelsMenu } from './markup.buttons';
import { TGCommand } from './tg-command.class';
import { Scenes } from 'telegraf';

export class ChannelsListScene {
	scene: any;
	menuButtons: any;
	backButton: any;
	constructor() {
		this.scene = new Scenes.BaseScene('channelsList');
		this.scene.enter(async (ctx: any) => {
			this.menuButtons = await new ChannelsMenu().urlButtonsMarkup().then((res: any) => res);

			this.backButton = await new BackButton().markup;
			this.menuButtons.push(this.backButton);
			ctx.reply('channels list', {
				reply_markup: {
					inline_keyboard: this.menuButtons,
				},
			});
		});
	}

	init() {
		console.log(`scene 2 init`);
	}
}
export class ChannelsListCommand extends TGCommand {
	scene: any;
	constructor(bot: any) {
		super(bot);
	}
	init() {
		try {
			this.bot.action('viewChannels', (ctx: any) => {
				ctx.scene.enter('channelsList');
				console.log(ctx);
			});
		} catch (e) {
			console.log(e);
		}
	}
}
