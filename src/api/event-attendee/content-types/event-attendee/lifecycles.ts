export default {
  async afterCreate(e) {
    try {
      const eventId = e.params.data.event.connect[0].id

      const event = await strapi
        .service('api::event.event')
        .findOne({ filters: { id: eventId } })

      const res = await strapi
        .service('api::event-attendee.event-attendee')
        .findMany({
          filters: {
            event: eventId,
          },
          select: ['participants'],
        })

      const totalParticipants = res.reduce(
        (sum, attendee) => sum + (attendee.participants || 0),
        0
      )

      await strapi.service('api::event.event').update({
        documentId: event.documentId,
        data: { totalAttending: totalParticipants },
        status: 'published',
      })
    } catch (error) {
      console.error('Error in afterCreate:', error)
    }
  },
}
