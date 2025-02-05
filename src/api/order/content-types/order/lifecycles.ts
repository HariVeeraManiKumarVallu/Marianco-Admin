export default {
	async beforeCreate(event) {
		const maxOrderNumber = await strapi.documents('api::order.order').findFirst({
			fields: 'orderNumber',
			sort: { orderNumber: 'desc' },
		});

		event.params.data.orderNumber = maxOrderNumber ? maxOrderNumber.orderNumber + 1 : 100000;
		return
	}
}
