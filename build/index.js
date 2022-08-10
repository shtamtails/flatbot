"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const https = require("https");
const zlib = require("zlib");
const options = {
    headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,ru;q=0.8,fr;q=0.7",
        "Cache-Control": "no-cache",
        Cookie: "fullscreen_cookie=1",
        Dnt: "1",
        Pragma: "no-cache",
        Referer: "https://www.kufar.by/listings",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36",
    },
};
https.get("https://www.kufar.by/l/r~minsk?ot=1&query=%D0%9D%D0%B0%D1%83%D1%88%D0%BD%D0%B8%D0%BA%D0%B8+Marshall+", options, (res) => {
    let data = [];
    const gunzip = zlib.createGunzip();
    res.pipe(gunzip);
    let buffer = [];
    gunzip
        .on("data", function (data) {
        // decompression chunk ready, add it to the buffer
        buffer.push(data.toString());
    })
        .on("end", function () {
        // response and decompression complete, join the buffer and return
        const result = buffer.join("");
        const startPoint = result.indexOf(`<script id="__NEXT_DATA__" type="application/json">`);
        const data = result.slice(startPoint);
        const endPoint = data.indexOf(`</script>`);
        const finalData = data.slice(51, endPoint);
        const test = JSON.parse(finalData);
        const listings = test.props.initialState.listing.ads;
        listings.map((listing) => {
            console.log(listing);
            // const images = listing.images;
            // const account = listing.account_parameters;
            // const priceBYN = listing.price_byn;
            // const priceUSD = listing.price_usd;
            // const adName = listing.subject;
            // const adLink = listing.ad_link;
            // console.log(`================================================`);
            // console.log(`Name: ${adName}`);
            // console.log(`Link: ${adLink}`);
            // account.map((info) => {
            //   console.log(`${info.pl}: ${info.v}`);
            // });
            // console.log(`Images:`);
            // images.map((image) => {
            //   const imgserver = image.id.slice(0, 2);
            //   console.log(`https://yams.kufar.by/api/v1/kufar-ads/images/${imgserver}/${image.id}.jpg?rule=gallery`);
            // });
            // console.log(`BYN: ${priceBYN}`);
            // console.log(`USD: ${priceUSD}`);
            // console.log(`================================================`);
        });
    })
        .on("error", (e) => {
        console.error(e);
    });
});
