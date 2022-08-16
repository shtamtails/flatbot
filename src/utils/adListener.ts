import { Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { IListing } from "../models/IListing";

export const setAdListener = async (ctx: Context<Update>, get: Function, send: Function) => {
  let lastAd: IListing[] = await get();
  await send(ctx, lastAd);
  setInterval(async () => {
    let newAd: IListing[] = await get();
    if (newAd[0].time !== lastAd[0].time) {
      lastAd = newAd;
      await send(ctx, newAd);
    } else {
    }
  }, 60000);
};
