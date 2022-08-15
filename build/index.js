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
import { Telegraf } from "telegraf";
import { getKufar, kufarSender } from "./kufar.js";
// import { createRequire } from "module";
// const require = createRequire(import.meta.url);
const token = "5790673136:AAG0zgux590LTLHsoykh5cV4CmRFnAFbNFQ";
const getOnliner = () => __awaiter(void 0, void 0, void 0, function* () {
    const link = `https://r.onliner.by/sdapi/ak.api/search/apartments?rent_type%5B%5D=2_rooms&price%5Bmin%5D=50&price%5Bmax%5D=300&currency=usd&only_owner=true&metro%5B%5D=red_line&metro%5B%5D=blue_line&metro%5B%5D=green_line&order=created_at%3Adesc&page=1&bounds%5Blb%5D%5Blat%5D=53.601382818288315&bounds%5Blb%5D%5Blong%5D=27.267348326485553&bounds%5Brt%5D%5Blat%5D=54.162092881927016&bounds%5Brt%5D%5Blong%5D=27.787728312241224&v=0.0077120208077992025`;
    const page = yield axios.get(link);
    const data = page.data;
});
const bot = new Telegraf(token);
bot.start((ctx) => __awaiter(void 0, void 0, void 0, function* () {
    let lastKufar = yield getKufar();
    yield kufarSender(ctx, lastKufar);
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        let newKufar = yield getKufar();
        newKufar[0].time !== lastKufar[0].time && (lastKufar = newKufar);
        if (newKufar[0].time !== lastKufar[0].time) {
            lastKufar = newKufar;
            yield kufarSender(ctx, newKufar);
        }
        else {
            yield ctx.reply(`no new objects:(`);
        }
    }), 10000);
}));
bot.launch();
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
