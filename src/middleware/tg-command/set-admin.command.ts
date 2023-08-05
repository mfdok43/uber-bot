import { TGCommand } from './tg-command.class';
import { SetPrivilegedUser } from '../../common/sequelize/user-model.sequelize';
import { FsOperations } from '../fs-operations/fs-operations';
import { SavePassword } from '../../common/password/password-model';

export class SetAdmin extends TGCommand {
	// private currentPassword: any
	fs: any;

	constructor(bot: any) {
		super(bot);
		this.fs = new FsOperations();
	}

	init() {
		try {
			console.log('init SetAdmin');

			// let currentPassword = this.fs.read("./src/middleware/fs-operations/password.txt", "utf-8")
			//
			// console.log(this.currentPassword, '1111111')

			this.fs.watch(
				'./src/middleware/fs-operations/password.txt',
				{ interval: 1000 },
				(curr: any, prev: any) => {
					const currentPassword = this.fs.read(
						'./src/middleware/fs-operations/password.txt',
						'utf-8',
					);
					console.log(currentPassword, 'watch');
				},
			);

			let currPass: any;

			this.bot.hears('/setadmin', (ctx: any) => {
				currPass = this.fs.read('./src/middleware/fs-operations/password.txt', 'utf-8');
				console.log(ctx.message.text, currPass, 'vot');
				ctx.reply('Enter the code');
			});

			this.bot.on('message', (ctx: any) => {
				if (ctx.message.text === currPass) {
					new SetPrivilegedUser().init(ctx.chat.id, true);
					ctx.reply('MEOW!');
					this.fs.delete('./src/middleware/fs-operations/password.txt');
				}
			});
		} catch (e) {
			console.log(e);
		}
	}
}
