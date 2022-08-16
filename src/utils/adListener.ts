import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { IListing } from "../models/IListing";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const cron = require("node-cron");

export const setAdListener = async (ctx: Context<Update>, get: Function, send: Function, schedule: string) => {
  let lastAd: IListing[] = await get();
  await send(ctx, lastAd);
  const listener = cron.schedule(schedule, async () => {
    let newAd: IListing[] = await get();
    if (newAd[0].time !== lastAd[0].time) {
      lastAd = newAd;
      await send(ctx, newAd);
    }
  });
};
