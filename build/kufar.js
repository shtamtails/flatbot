var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from "axios";
export const getKufar = () => __awaiter(void 0, void 0, void 0, function* () {
    const link = "https://re.kufar.by/l/minsk/snyat/kvartiru-dolgosrochno/2k/bez-posrednikov?cur=USD&oph=1&prc=r%3A0%2C300";
    const page = yield axios.get(link);
    const parseDataJson = (page) => {
        const result = page.data;
        const startPoint = result.indexOf(`<script id="__NEXT_DATA__" type="application/json">`);
        const firstPart = result.slice(startPoint);
        const endPoint = firstPart.indexOf(`</script>`);
        const finalData = firstPart.slice(51, endPoint);
        const finalResult = JSON.parse(finalData);
        return finalResult.props.initialState.listing.ads;
    };
    const listings = parseDataJson(page);
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
});
export const kufarSender = (ctx, item) => __awaiter(void 0, void 0, void 0, function* () {
    const media = item[0].images.map((image) => {
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
});
