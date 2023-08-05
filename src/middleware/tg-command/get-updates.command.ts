import { TGCommand } from './tg-command.class';
import { ConfigService } from '../../config/config.service';

export class GetUpdatesCommand extends TGCommand {
	// private currentPassword: any
	constructor(bot: any) {
		super(bot);
	}

	init() {
		console.log('init getUpdates');
		this.bot.hears('/updates', (ctx: any) => {
			const configService = new ConfigService();
			fetch(
				`https://api.telegram.org/bot${configService.get(
					'TELEGRAM_API_TOKEN',
				)}/getUpdates?offset=100`,
			)
				.then((res: any) => res.json())
				.then((res) => {
					console.log(res.result);
				});
		});
	}
}
