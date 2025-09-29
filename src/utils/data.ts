export const reWriteAgendaItem = (agendaItem: AgendaItem) => {
  return {
    description: agendaItem.description,
    date: new Date(agendaItem.date.split("/").reverse().join("-")),
    locations: agendaItem.locations.map((label, index) => ({
      label, link: agendaItem['locations-links']?.[index]
    })),

    _: agendaItem,
  }
}
