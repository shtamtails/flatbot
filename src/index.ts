import { Context, Telegraf } from "telegraf";
import { Kufar } from "./kufar.js";
import { Onliner } from "./onliner.js";
import * as dotenv from "dotenv";
import { setAdListener } from "./utils/adListener.js";
import { Update } from "telegraf/typings/core/types/typegram.js";
import axios from "axios";
import { IListing } from "./models/IListing.js";
dotenv.config();

const kufar = new Kufar();
const onliner = new Onliner();
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.TOKEN!);

bot.start(async (ctx) => {
  setAdListener(ctx, kufar.get, kufar.send);
  setAdListener(ctx, onliner.get, onliner.send);
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
