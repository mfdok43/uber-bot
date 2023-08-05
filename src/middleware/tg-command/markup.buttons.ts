import { GetChannels } from '../../common/sequelize/channel-model.sequelize';
import {
	GetUsersByPrivileged,
	GetUsers,
	GetUsersBySeller,
} from '../../common/sequelize/user-model.sequelize';

export class MainMenu {
	markup: any;
	constructor() {
		this.markup = [
			{ text: `Channels list`, callback_data: 'viewChannels' },
			{ text: 'New post', callback_data: 'createPost' },
		];
	}
}

export class BackButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'Main menu', callback_data: 'mainMenu' }];
	}
}

export class CreatePostButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'Create post', callback_data: 'createPost' }];
	}
}

export class CreateIntervalPostingButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'Create interval posting', callback_data: 'createIntervalPosting' }];
	}
}

export class SelectAllButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'Select all', callback_data: 'selectAll' }];
	}
}

export class IntervalPostingButton {
	markup: any;
	constructor() {
		this.markup = [{ text: 'IntervalPosting', callback_data: 'intervalPosting' }];
	}
}

export class ChannelsMenu {
	channelsList: any;
	buttons: any;
	urlButtons: any;

	async buttonsMarkup() {
		this.channelsList = await new GetChannels().getChannels;
		this.buttons = this.channelsList.map((c: any) => {
			return [{ text: c.channelName, callback_data: c.telegramId }];
		});
		return this.buttons;
	}

	async urlButtonsMarkup() {
		this.channelsList = await new GetChannels().getChannels;
		this.urlButtons = this.channelsList.map((c: any) => {
			return [{ text: c.channelName, url: `t.me/${c.channelTitle}` }];
		});
		return this.urlButtons;
	}
}

export class UsersMenu {
	usersList: any;
	markup: any;

	async init() {
		this.usersList = await new GetUsers().init();
		// console.log(this.usersList, 'list')

		this.markup = this.usersList.map((c: any) => {
			return [{ text: c.username, url: `t.me/${c.username}` }];
		});
		return this.markup;
	}
}

// export class ChannelsMenu {
//     channelsList: any
//     markup: any;
//
//     async init () {
//         this.channelsList = await new GetChannels().getChannels
//
//         this.markup = []
//         let mainArr:any = []
//
//         let counter = 0
//
//         this.channelsList.forEach((c: any, i: number) => {
//             let secondaryArr: any = []
//             if (i % 2 == 0) {
//                 secondaryArr.push({ text: c.channelName, url: `t.me/${c.channelTitle}` })
//             } else {
//                 counter++
//                 secondaryArr.push({ text: c.channelName, url: `t.me/${c.channelTitle}` })
//
//                 console.log(mainArr, 'mainarr')
//             }
//             if (i > 0 && i % 2 == 0) {
//                 mainArr.push(secondaryArr)
//             }
//
//             this.markup = mainArr
//
//         })
//         return this.markup
//     }
// }
