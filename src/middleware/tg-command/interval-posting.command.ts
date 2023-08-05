import { BackButton } from './markup.buttons';
import { TGCommand } from './tg-command.class';
import { Scenes } from 'telegraf';

export class IntervalPostingScene {
	scene: any;
	backButton: any;
	constructor() {
		this.scene = new Scenes.BaseScene('intervalPosting');
		this.scene.enter(async (ctx: any) => {
			this.backButton = await new BackButton().markup;
			ctx.reply('Interval posting. Set timer HH:MM.', {
				reply_markup: {
					inline_keyboard: [this.backButton],
				},
			});
		});
	}

	init() {
		console.log(`scene 3 init`);
	}
};
