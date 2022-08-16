import axios, { AxiosResponse } from "axios";
import { Markup } from "telegraf";
import { IListing } from "./models/IListing";

export class Kufar {
  async get() {
    const link =
      "https://re.kufar.by/l/minsk/snyat/kvartiru-dolgosrochno/2k/bez-posrednikov?cur=USD&mee=v.or%3A2%2C5%2C32%2C12%2C16%2C20%2C23%2C27%2C28%2C24%2C21%2C17%2C13%2C9%2C6%2C3%2C4%2C7%2C10%2C14%2C18%2C22%2C25%2C29%2C30%2C26%2C33%2C19%2C15%2C11%2C8%2C31&oph=1&prc=r%3A0%2C300&size=30";
    const page = await axios.get(link);

    const parseDataJson = (page: AxiosResponse) => {
      const result = page.data;
      const startPoint = result.indexOf(`<script id="__NEXT_DATA__" type="application/json">`);
      const firstPart = result.slice(startPoint);
      const endPoint = firstPart.indexOf(`</script>`);
      const finalData = firstPart.slice(51, endPoint);
      const finalResult = JSON.parse(finalData);
      return finalResult.props.initialState.listing.ads;
    };

    const listings: IKUFAR.Listing[] = parseDataJson(page);

    const convertedListings = listings.map((listing) => {
      const time = new Date(listing.list_time).toLocaleString("en-US");
      const link = listing.ad_link;
      const priceUSD = (Number(listing.price_usd) / 100).toFixed(2);
      const priceBYN = (Number(listing.price_byn) / 100).toFixed(2);
      const name = listing.account_parameters.filter((param) => param.p === "name")[0].v || "Имя не указано";
      const address = listing.account_parameters.filter((param) => param.p === "address")[0].v || "Адрес не указан";
      const images = listing.images;
      return {
        time,
        link,
        priceBYN,
        priceUSD,
        name,
        address,
        images,
      };
    });
    return convertedListings;
  }
  // ? what is the correct type?
  async send(ctx: any, item: IListing[]) {
    const media =
      item[0].images &&
      item[0].images.map((image: IKUFAR.Image) => {
        const id = image.id;
        const path = id.slice(0, 2);
        const link: string = image.yams_storage
          ? `https://yams.kufar.by/api/v1/kufar-ads/images/${path}/${id}.jpg?rule=gallery`
          : `https://cache1.kufar.by/gallery/${path}/${id}.jpg`;
        const result = {
          media: link,
          type: "photo",
        };
        return result;
      });
    media && (await ctx.replyWithMediaGroup(media.length < 8 ? media : media.slice(0, 8)));
    await ctx.reply(
      `
📆 Добавлено: ${item[0].time}
💵 Цена: ${item[0].priceBYN} BYN или ${item[0].priceUSD} USD
👤 Имя: ${item[0].name}
🏠 Адрес: ${item[0].address}
    `,
      Markup.inlineKeyboard([Markup.button.url("Visit", item[0].link)])
    );
  }
}
