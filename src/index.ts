import axios, { AxiosResponse } from "axios";
import { Telegraf } from "telegraf";
import { getKufar, kufarSender } from "./kufar.js";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

const token = "5790673136:AAG0zgux590LTLHsoykh5cV4CmRFnAFbNFQ";

export interface IListing {
  time: string;
  link: string;
  priceBYN: string;
  priceUSD: string;
  name: string;
  address: string;
  images: IKUFAR.Image[];
}

const getOnliner = async () => {
  const link = `https://r.onliner.by/sdapi/ak.api/search/apartments?rent_type%5B%5D=2_rooms&price%5Bmin%5D=50&price%5Bmax%5D=300&currency=usd&only_owner=true&metro%5B%5D=red_line&metro%5B%5D=blue_line&metro%5B%5D=green_line&order=created_at%3Adesc&page=1&bounds%5Blb%5D%5Blat%5D=53.601382818288315&bounds%5Blb%5D%5Blong%5D=27.267348326485553&bounds%5Brt%5D%5Blat%5D=54.162092881927016&bounds%5Brt%5D%5Blong%5D=27.787728312241224&v=0.0077120208077992025`;
  const page = await axios.get(link);
  const data: IONLINER.Apartment[] = page.data;
};

const bot = new Telegraf(token);
bot.start(async (ctx: any) => {
  let lastKufar = await getKufar();
  await kufarSender(ctx, lastKufar);
  setInterval(async () => {
    let newKufar = await getKufar();
    newKufar[0].time !== lastKufar[0].time && (lastKufar = newKufar);
    if (newKufar[0].time !== lastKufar[0].time) {
      lastKufar = newKufar;
      await kufarSender(ctx, newKufar);
    }
  }, 60000);
});

bot.launch();

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
