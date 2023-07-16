import {TGCommand} from "./tg-command.class";
import {FsOperations} from "../fs-operations/fs-operations";
import {ConfigService} from "../../config/config.service";

export class AnyMessage extends TGCommand {
    constructor(bot: any) {
        super(bot);
    }

    init() {
        console.log('init AnyMessage')
        try {
            this.bot.on('message', (ctx: any) => {
                if (ctx.message.text.toLowerCase() == `привет` || ctx.message.text.toLowerCase() == 'привіт' || ctx.message.text.toLowerCase() == 'hello') {
                    ctx.reply(`Слава Україні🇺🇦`)
                } else if (ctx.message.text.toLowerCase() == `хуй`) {
                    ctx.reply(`Розпуста`)
                } else {
                    ctx.reply(`Ти написав ${ctx.message.text}`)
                }
            })
        } catch (e) {
            console.log(e)
        }
    }

    set() {

    }
}