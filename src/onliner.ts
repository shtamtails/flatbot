import axios from "axios";
import { Context, Markup } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram";
import { IListing } from "./models/IListing";

export class Onliner {
  async get() {
    const link = `https://r.onliner.by/sdapi/ak.api/search/apartments?rent_type%5B%5D=2_rooms&price%5Bmin%5D=50&price%5Bmax%5D=300&currency=usd&only_owner=true&metro%5B%5D=red_line&metro%5B%5D=blue_line&metro%5B%5D=green_line&order=created_at%3Adesc&page=1&bounds%5Blb%5D%5Blat%5D=53.601382818288315&bounds%5Blb%5D%5Blong%5D=27.267348326485553&bounds%5Brt%5D%5Blat%5D=54.162092881927016&bounds%5Brt%5D%5Blong%5D=27.787728312241224&v=0.0077120208077992025`;
    const page = await axios.get(link).catch((e) => {
      console.error(e.statusMessage);
    });
    const data: IONLINER.Apartment[] = page?.data.apartments;
    const convertedListings = data.map((listing) => {
      const time: string = new Date(listing.created_at).toLocaleString("ru-RU", { timeZone: "Europe/Minsk" });
      const link: string = listing.url;
      const priceBYN: string = String(listing.price.converted.BYN.amount);
      const priceUSD: string = String(listing.price.converted.USD.amount);
      const name: string = "не указано";
      const address: string = listing.location.address;
      const image: string = listing.photo;
      return {
        time,
        link,
        priceBYN,
        priceUSD,
        name,
        address,
        image,
      };
    });
    return convertedListings;
  }

  async send(ctx: Context<Update>, item: IListing[]) {
    item[0].image && (await ctx.replyWithPhoto(item[0].image));
    await ctx.reply(
      `
📆 Добавлено: ${item[0].time}
💵 Цена: ${item[0].priceUSD} USD или ${item[0].priceBYN} BYN
👤 Имя: ${item[0].name}
🏠 Адрес: ${item[0].address}
      `,
      Markup.inlineKeyboard([Markup.button.url("Visit", item[0].link)])
    );
  }
}
