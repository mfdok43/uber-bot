import {TGCommand} from "./tg-command.class";
import {SavePassword} from "../../common/password/password-model";
import {FsOperations} from "../fs-operations/fs-operations";



export class SendPassword extends TGCommand {

    savePass: any
    fs: any
    constructor(bot: any) {
        super(bot);
        this.savePass = ''
        this.fs = new FsOperations()
    }
    init(): void {
        console.log('init SendPassword')

        try {
             this.bot.hears('/passgen', (ctx: any) => {
                 this.savePass = new SavePassword().init()
                 this.bot.telegram.sendMessage("363423028",`Hello, new pass is ${this.savePass}`)
                 this.bot.telegram.sendMessage(ctx.chat.id,`Hello, new pass is *********`)
                 this.fs.write("./src/middleware/fs-operations/password.txt", this.savePass)
            });
        } catch (e) {
            console.log(e)
        }
    }
}

