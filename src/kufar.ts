import axios, { AxiosResponse } from "axios";
import { IListing } from ".";

export const getKufar = async () => {
  const link =
    "https://re.kufar.by/l/minsk/snyat/kvartiru-dolgosrochno/2k/bez-posrednikov?cur=USD&oph=1&prc=r%3A0%2C300";
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
};

export const kufarSender = async (ctx: any, item: IListing[]) => {
  const media = item[0].images.map((image: IKUFAR.Image) => {
    const id = image.id;
    const path = id.slice(0, 2);
    const link = image.yams_storage
      ? `https://yams.kufar.by/api/v1/kufar-ads/images/${path}/${id}.jpg?rule=gallery`
      : `https://cache1.kufar.by/gallery/${path}/${id}.jpg`;
    const result = {
      media: link,
      type: "photo",
    };
    return result;
  });
  ctx.replyWithMediaGroup(media.length < 8 ? media : media.slice(0, 8));
  ctx.reply(`
  📆 Добавлено: ${item[0].time}
  🧷 Ссылка: ${item[0].link}
  💵 Цена: ${item[0].priceBYN} BYN или ${item[0].priceUSD} USD
  👤 Имя: ${item[0].name}
  🏠 Адрес: ${item[0].address}
  `);
};
