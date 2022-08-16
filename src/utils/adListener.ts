import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";

export const setAdListener = async (ctx: Context<Update>, get: Function, send: Function) => {
  let lastAd = await get();
  await send(ctx, lastAd);
  setInterval(async () => {
    let newAd = await get();
    newAd[0].time !== lastAd[0].time && (lastAd = newAd);
    if (newAd[0].time !== lastAd[0].time) {
      lastAd = newAd;
      await send(ctx, newAd);
    } else {
      ctx.reply("im still alive!");
    }
  }, 60000);
};
