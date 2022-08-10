export interface IListings {
  ads: IListing[];
}

export interface IListing {
  account_id: number;
  account_parameters: IAccount[]; //!
  ad_link: string;
  currency: string;
  images: IImage[]; //!
  list_time: string;
  phone_hidden: boolean;
  price_byn: string;
  price_usd: string;
  subject: string;
}

export interface IImage {
  id: string;
  yams_storage: boolean;
}

export interface IAccount {
  pl: string;
  vl: string;
  p: string;
  v: string;
  pu: string;
}
