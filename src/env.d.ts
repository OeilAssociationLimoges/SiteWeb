/// <reference path="../.astro/types.d.ts" />

interface AgendaItem {
  date: string
  location: string
  "location-link"?: string
  description: string
}

interface ProductVariant {
  id: string
  name: string
  images: Array<string>
}

interface ProductInputBase {
  id: string
  name: string
}

interface ProductInputText extends ProductInputBase {
  type: "text"
  placeholder: string
}

interface ProductInputSelect extends ProductInputBase {
  type: "select"
  options: Array<{
    name: string
    value: string
  }>
}

type ProductInput = (
  | ProductInputText
  | ProductInputSelect
)

interface ProductItem {
  id: string
  name: string
  description: string
  price: number
  adherant_price: number
  
  variants: Array<ProductVariant>
  inputs?: Array<ProductInput>
}

declare module "*.yml" {
  const value: Array<AgendaItem | ProductItem>;
  export default value;
}

declare const __PAYPAL_BASE__: string;
