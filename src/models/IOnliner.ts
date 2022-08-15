declare module IONLINER {
  export interface BYN {
    amount: string;
    currency: string;
  }

  export interface USD {
    amount: string;
    currency: string;
  }

  export interface Converted {
    BYN: BYN;
    USD: USD;
  }

  export interface Price {
    amount: string;
    currency: string;
    converted: Converted;
  }

  export interface Location {
    address: string;
    user_address: string;
    latitude: number;
    longitude: number;
  }

  export interface Contact {
    owner: boolean;
  }

  export interface Apartment {
    id: number;
    price: Price;
    rent_type: string;
    location: Location;
    photo: string;
    contact: Contact;
    created_at: Date;
    last_time_up: Date;
    up_available_in: number;
    url: string;
  }

  export interface Page {
    limit: number;
    items: number;
    current: number;
    last: number;
  }

  export interface RootObject {
    apartments: Apartment[];
    total: number;
    page: Page;
  }
}
