import { Context, session } from 'telegraf';

export interface SessionData {
	isText: string;
	isLink: string;
	isPhoto: string;
	replyTex: string;
}

export interface IBotContext extends Context {
	session: SessionData;
}