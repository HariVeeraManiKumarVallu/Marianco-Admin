export default {
	async beforeCreate(event) {
		const maxOrderNr = await strapi.documents('api::order.order').findFirst({
			fields: 'orderNumber',
			sort: { orderNr: 'desc' },
		});

		event.params.data.orderNr = maxOrderNr ? maxOrderNr.orderNr + 1 : 100000;
		return
	}
}
