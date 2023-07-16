import {TGCommand} from "./tg-command.class";
import {MainMenu} from "./markup.buttons";

export class BackButtonCommand extends TGCommand{
    menuButtons: any
    constructor(bot: any) {
        super(bot);
        this.menuButtons = new MainMenu().markup
    }

    init() {
        try {
            this.bot.action('mainMenu', (ctx: any) => {
                console.log('leave')
                ctx.scene.leave()
                ctx.reply('Main menu. You can send commands.',	 {
                    reply_markup: {
                        inline_keyboard: [
                            this.menuButtons]}})

            })
        } catch (e) {
            console.log(e)
        }
    }
}