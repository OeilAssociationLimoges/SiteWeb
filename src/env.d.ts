/// <reference path="../.astro/types.d.ts" />

interface AgendaItem {
  date: string
  location: string
  "location-link"?: string
  description: string
}

interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  image: string
}

declare module "*.yml" {
  const value: Array<AgendaItem | ProductItem>;
  export default value;
}

declare const __PAYPAL_BASE__: string;
