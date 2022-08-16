import axios, { AxiosResponse } from "axios";
import { Markup } from "telegraf";
import { IListing } from "./models/IListing";

export class Kufar {
  async get() {
    const link =
      "https://re.kufar.by/l/minsk/snyat/kvartiru-dolgosrochno/2k/bez-posrednikov?cur=USD&mee=v.or%3A2%2C5%2C32%2C12%2C16%2C20%2C23%2C27%2C28%2C24%2C21%2C17%2C13%2C9%2C6%2C3%2C4%2C7%2C10%2C14%2C18%2C22%2C25%2C29%2C30%2C26%2C33%2C19%2C15%2C11%2C8%2C31&oph=1&prc=r%3A0%2C300&size=30";
    const page = await axios.get(link).catch((e) => {
      console.error(e.statusMessage);
    });

    const parseDataJson = (page: AxiosResponse) => {
      const result = page.data;
      const startPoint = result.indexOf(`<script id="__NEXT_DATA__" type="application/json">`);
      const firstPart = result.slice(startPoint);
      const endPoint = firstPart.indexOf(`</script>`);
      const finalData = firstPart.slice(51, endPoint);
      const finalResult = JSON.parse(finalData);
      return finalResult.props.initialState.listing.ads;
    };

    const listings: IKUFAR.Listing[] = page ? parseDataJson(page) : undefined;

    const convertedListings = listings.map((listing) => {
      const time = new Date(listing.list_time).toLocaleString("ru-RU", { timeZone: "Europe/Minsk" });
      const link = listing.ad_link;
      const priceUSD = (Number(listing.price_usd) / 100).toFixed(2);
      const priceBYN = (Number(listing.price_byn) / 100).toFixed(2);
      const name = listing.account_parameters.filter((param) => param.p === "name")[0].v || "Имя не указано";
      const address = listing.account_parameters.filter((param) => param.p === "address")[0].v || "Адрес не указан";
      const images = listing.images;
      const ad_id = listing.ad_id;
      const phone_hidden = listing.phone_hidden;
      return {
        time,
        link,
        priceBYN,
        priceUSD,
        name,
        address,
        images,
        ad_id,
        phone_hidden,
      };
    });
    return convertedListings;
  }

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

    const getNumber = async (ad_id: number) => {
      const response = await axios.get(`https://cre-api-v2.kufar.by/items-search/v1/engine/v1/item/${ad_id}/phone`, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36",
        },
      });
      const data = response.data.phone.split(",");
      const formattedPhone = data.map((number: string) => {
        return number.trim().replace(/(375)(29|25|33|44)(\d{3})(\d{2})(\d{2})/, "+$1 ($2) $3-$4-$5");
      });
      return formattedPhone;
    };

    const number = item[0].phone_hidden ? "Телефон скрыт" : await getNumber(item[0].ad_id);

    await ctx.reply(
      `
📆 Добавлено: ${item[0].time}
💵 Цена: ${item[0].priceUSD} USD или ${item[0].priceBYN} BYN
👤 Имя: ${item[0].name}
🏠 Адрес: ${item[0].address}
📞 Номер: ${number}
    `,
      Markup.inlineKeyboard([Markup.button.url("Visit", item[0].link)])
    );
  }
}
