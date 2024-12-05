export default {
  async afterCreate(e) {
    try {
      // console.log('Full params:', e.params)
      // console.log('Full result:', e.result)

      const eventId = e.params.data.event.connect[0].id
      // console.log('Event ID from params:', eventId)

      const event = await strapi
        .documents('api::event.event')
        .findFirst({ filters: { id: eventId } })

      console.log('Found event:', event)

      const res = await strapi
        .documents('api::event-attendee.event-attendee')
        .findMany({
          filters: {
            event: eventId,
          },
          select: ['participants'],
        })

      console.log('Results:', res)

      const totalParticipants = res.reduce(
        (sum, attendee) => sum + (attendee.participants || 0),
        0
      )

      await strapi.documents('api::event.event').update({
        documentId: event.documentId,
        data: { totalAttending: totalParticipants },
        status: 'published',
      })
    } catch (error) {
      console.error('Error in afterCreate:', error)
    }
  },
}
