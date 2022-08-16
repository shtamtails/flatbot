export interface IListing {
  time: string;
  link: string;
  priceBYN: string;
  priceUSD: string;
  name: string;
  address: string;
  images?: IKUFAR.Image[];
  image?: string;
}
