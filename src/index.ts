import { Context, Markup, Telegraf } from "telegraf";
import { Kufar } from "./kufar.js";
import { Onliner } from "./onliner.js";
import * as dotenv from "dotenv";
import { Update } from "telegraf/typings/core/types/typegram.js";
import { setAdListener } from "./utils/adListener.js";
dotenv.config();

const kufar = new Kufar();
const onliner = new Onliner();
const bot: Telegraf<Context<Update>> = new Telegraf(process.env.TOKEN!);

bot.start(async (ctx) => {
  return await ctx.reply(
    "Select option",
    Markup.keyboard([["🔍 Subscribe", "😞 Unsubscribe"]])
      .oneTime()
      .resize()
  );
});

bot.hears("🔍 Subscribe", async (ctx) => {
  ctx.reply("Subscribed to Kufar and Onliner!");
  const schedule = "*/5 * * * *";
  setAdListener(ctx, kufar.get, kufar.send, schedule);
  setAdListener(ctx, onliner.get, onliner.send, schedule);
});

bot.hears("😞 Unsubscribe", (ctx) => {
  ctx.reply("Uhh, sorry, not working yet...");
});

bot.hears("up?", (ctx) => {
  ctx.reply("Yes, i'm stil up");
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
