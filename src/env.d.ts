/// <reference path="../.astro/types.d.ts" />

interface AgendaItem {
  date: string
  type: "event"
  location: string
  "location-link"?: string
  description: string
}

declare module "*.yml" {
  const value: Array<AgendaItem>;
  export default value;
}
