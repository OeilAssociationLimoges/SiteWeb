/// <reference path="../.astro/types.d.ts" />

interface AgendaItem {
  date: string
  locations: string[]
  "locations-links"?: string[]
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
  max_characters?: number
  /** regex */
  validation?: string
  /** @default false */
  required?: boolean
}

interface ProductInputSelect extends ProductInputBase {
  type: "select"
  options: Array<{
    name: string
    value: string
    disable_when?: Record<string, Array<string>>
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
  year: number
  can_buy?: boolean
  
  variants: Array<ProductVariant>
  inputs?: Array<ProductInput>
}

declare module "*.yml" {
  const value: Array<AgendaItem | ProductItem>;
  export default value;
}

declare const __PAYPAL_BASE__: string;
