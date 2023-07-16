import {TGCommand} from "./tg-command.class";
import {SaveChannel, SetChannelAdmin} from "../../common/sequelize/channel-model.sequelize";
import {ConfigService} from "../../config/config.service";

export class GetUpdatesCommand extends TGCommand {
    // private currentPassword: any
    constructor(bot: any) {
        super(bot);
    }

   init () {
       console.log('init getUpdates')
    this.bot.hears('/updates', (ctx: any) => {
        let configService = new ConfigService()
        fetch(`https://api.telegram.org/bot${configService.get("TELEGRAM_API_TOKEN")}/getUpdates?offset=10`).then((res: any) => res.json()).then((res) => {
                    console.log(res.result)
        })
    })
  }
}
