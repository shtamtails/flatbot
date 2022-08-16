declare module IKUFAR {
  export interface Listings {
    ads: Listing[];
  }

  export interface Listing {
    account_id: number;
    account_parameters: Account[];
    ad_id: number;
    ad_link: string;
    currency: string;
    images: Image[];
    list_time: string;
    phone_hidden: boolean;
    price_byn: string;
    price_usd: string;
    subject: string;
  }

  export interface Image {
    id: string;
    yams_storage: boolean;
  }

  export interface Account {
    pl: string;
    vl: string;
    p: string;
    v: string;
    pu: string;
  }
}
