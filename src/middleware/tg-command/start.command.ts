import {TGCommand} from "./tg-command.class";
import {GetUser, SaveUser} from "../../common/sequelize/user-model.sequelize";
import { UserModel } from '../../models/user.model';
import { Sequelize } from 'sequelize';
import {Db} from "../../connections/db.connection";
import {MainMenu} from "./markup.buttons";


export class StartCommand extends TGCommand {

	menuButtons: any
	db: Sequelize
	userModel: any

	constructor(bot: any) {
		super(bot);
		this.db = new Db().sequelize
		this.userModel = new UserModel().userModel
		this.menuButtons = new MainMenu().markup
	}
	init() {

		this.bot.start((ctx: any) => {
			console.log(ctx.from, 'start')

			let id = ctx.chat.id
			let log = ctx.chat.username || `${ctx.from.first_name + (' '+ctx.from.last_name) || ''}` || 'anon'

			 new SaveUser(id.toString() ,log.toString()).init()
			 new GetUser().init(id.toString()).then((res: any) => {
				 let dbUserInfo = res?.dataValues
				 console.log(dbUserInfo)
				 if (dbUserInfo.privileged == true) {
					 ctx.reply(`Hello, admin! You can send commands.`,
						 {
						 reply_markup: {
							 inline_keyboard: [
								 this.menuButtons]}}
					 );
				 }
				 if (dbUserInfo.privileged == false) {
					 ctx.reply(`Hello, user! You can send commands.`);
				 }
			 })
		});
	}
}




