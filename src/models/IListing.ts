export interface IListing {
  time: string;
  link: string;
  priceBYN: string;
  priceUSD: string;
  name: string;
  address: string;
  images?: IKUFAR.Image[];
  image?: string;
  number?: { phone: string };
  ad_id: number;
  phone_hidden: boolean;
}
