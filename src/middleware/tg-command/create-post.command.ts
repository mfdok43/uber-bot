import {TGCommand} from "./tg-command.class";
import {Scenes} from "telegraf";
import {BackButton, CreatePostButton, ChannelsMenu, SelectAllButton} from "./markup.buttons";
import {ConfigService} from "../../config/config.service";
import {GetChannel, SaveChannel, SetChannelAdmin} from "../../common/sequelize/channel-model.sequelize";

const setSmile = (obj: any, smile: any) => {
    console.log(obj)
    obj = smile
    console.log(obj)

}

export class CreatePostScene extends TGCommand{
    scene: any
    channelsButtons: any
    backButton: any
    createPostButton: any
    selectAllButton: any
    replyMarkup: any
    constructor(bot: any) {

        super(bot)
        this.scene = new Scenes.BaseScene('createPost')
    }

    init () {
        console.log('scene init')
        this.scene.enter(async (ctx: any) => {
            let session = ctx.scene.session
            session.isText = `❌`
            session.isLink = `❌`
            session.isPhoto = `❌`
            session.replyText = `Create post: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`
            session.selectedChannelsList = []

            console.log('enter')
            this.channelsButtons = await new ChannelsMenu().buttonsMarkup().then((res: any) => res)

            this.backButton = new BackButton().markup
            this.selectAllButton = new SelectAllButton().markup
            this.createPostButton = new CreatePostButton().markup
            this.replyMarkup ={reply_markup: {inline_keyboard:
                        [...this.channelsButtons, this.selectAllButton, this.createPostButton, this.backButton]
                }}

            ctx.reply(session.replyText, this.replyMarkup)
        })

        this.scene.action(/-100/, (ctx: any) => {
            let session = ctx.scene.session
           try {
               new GetChannel().init(ctx.match.input).then((res: any) => {
                   session.dataValues = res.dataValues
                   if (session.selectedChannelsList.length > 0) {
                       session.channelIndex = session.selectedChannelsList.findIndex((c: any) => c.callback_data == ctx.match.input)
                       if (session.channelIndex != -1) {
                           session.selectedChannelsList.splice(session.channelIndex, 1)
                       } else {
                           session.selectedChannelsList.push({ text: res.dataValues.channelName, callback_data: res.dataValues.telegramId})
                       }
                   } else {
                       session.selectedChannelsList.push({ text: res.dataValues.channelName, callback_data: res.dataValues.telegramId})
                   }
                   console.log(session.selectedChannelsList, 'listt')
               })

           } catch (e) {
               console.log(e)
           }
        })

        this.scene.action('selectAll',async (ctx: any) => {
           //  let configService = new ConfigService()
           // await fetch(`https://api.telegram.org/bot${configService.get("TELEGRAM_API_TOKEN")}/getUpdates?offset=-10`).then((res: any) => res.json()).then((res) => {
           //      if (res?.result?.length) {
           //          console.log(res, 'res')
           //      } else {
           //          console.log('empty results')
           //      }
           //  })

            let session = ctx.scene.session
            try {
                session.selectedChannelsList = []
                this.channelsButtons.forEach((c: any) => {
                    c.forEach((c: any) => session.selectedChannelsList.push(c))
                })
                console.log(session.selectedChannelsList, 'channels')
            } catch (e) {
                console.log(e)
            }

        })

        this.scene.on('photo', (ctx: any) => {
            let session = ctx.scene.session
            console.log(ctx.message.photo[0], 'photo')
            session.photoId = ctx.message.photo[0].file_id
            session.isPhoto = `✔️`
            session.replyText = `Create post: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`
            ctx.reply(ctx.scene.session.replyText, this.replyMarkup)
        })

        this.scene.on('message', async (ctx: any) => {
            let session = ctx.scene.session
            this.channelsButtons = await new ChannelsMenu().buttonsMarkup().then((res: any) => res)
            console.log(this.channelsButtons, 'cnl')
            session.messageText = ctx.message.text
            session.isText = `✔️`
            session.replyText = `Create post: text(!)${session.isText} link${session.isLink} photo${session.isPhoto}`
            ctx.reply(session.replyText, this.replyMarkup)

            console.log(ctx.message.text, ctx.scene.session.messageText, '1=1')
        })

        this.scene.action('createPost', (ctx: any) => {
            let cfg = new ConfigService()
            let session = ctx.scene.session
            console.log(session.link, 'lnk')
            const data = JSON.stringify({
                caption: session.messageText,
                photo: session.photoId?.toString( ) || 'https://upload.wikimedia.org/wikipedia/commons/2/24/Velyki-Hai-Nashi-Hai-15057967.jpg',
                reply_markup: {inline_keyboard:
                        [[{ text: 'Connect with seller', url: session.link || `t.me/mfdok43` }]]
                }
            })

            if (session.selectedChannelsList.length == 0) {
                ctx.reply('Enter at least 1 channel')
            } else if (session.selectedChannelsList.length == 1) {
                fetch(`https://api.telegram.org/bot${cfg.get("TELEGRAM_API_TOKEN")}/sendPhoto?chat_id=${session.selectedChannelsList[0].callback_data}`, {
                    method: "POST",
                    headers: {
                        "Connection": "close",
                        "Content-Type": "application/json",
                    },
                    body: data
                }).then(res => res.json()).then(res => console.log(res))
            } else {
                session.selectedChannelsList.forEach((s: any) => {
                    fetch(`https://api.telegram.org/bot${cfg.get("TELEGRAM_API_TOKEN")}/sendPhoto?chat_id=${s.callback_data}`, {
                        method: "POST",
                        headers: {
                            "Connection": "close",
                            "Content-Type": "application/json",
                        },
                        body: data
                    }).then(res => res.json()).then(res => console.log(res))
                })
            }
         })
    }
}
export class CreatePostCommand extends TGCommand{
    scene: any
    constructor(bot: any) {
        super(bot)
    }
    init() {
        try {
            this.bot.action('createPost',async (ctx: any) => {
               await ctx.scene.enter('createPost')
            })
        } catch (e) {
            console.log(e)
        }
    }
}


