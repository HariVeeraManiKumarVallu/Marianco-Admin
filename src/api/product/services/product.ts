/**
 * product service
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreService('api::product.product', ({ strapi }) => ({
	async addProduct({
		shopId,
		productId,
	}: {
		shopId: number
		productId: string
	}) {
		const res = await fetch(
			`https://api.printify.com/v1/shops/${shopId}/products/${productId}.json`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`,
				},
			}
		)
		const data = (await res.json()) as PrintifyProduct

		const skus = []
		const optionIds = new Set()

		const formattedVariants = data.variants
			.filter(v => v.is_enabled)
			.map(
				(variant: VariantPrintify) => {
					const variantId = variant.id
					skus.push({ variantId, skuId: variant.sku })
					variant.options.forEach(o => optionIds.add(o))
					return {
						variantId,
						cost: variant.cost,
						price: variant.price,
						weight: variant.grams,
						isEnabled: variant.is_enabled,
						isDefault: variant.is_default,
						isAvailable: variant.is_available,
						options: variant.options,
					}
				}
			)


		const selectedOptions = data.options.map(option => ({
			...option, values: option.values.filter(v => optionIds.has(v.id)).map(v => {
				const variantId = formattedVariants.find(variant => variant.options.find(option => option === v.id)).variantId
				if (option.type === 'color') {
					return {
						...v, previewUrl: data.images.find(img => img.variant_ids.some(id => id === variantId)).src
					}
				}
				return v
			})
		}))

		const optionTypes = await strapi.service('api::product-option-type.product-option-type').getOptionTypes(selectedOptions)

		const optionValues = await strapi
			.service('api::product-option-value.product-option-value')
			.addProductOptions(selectedOptions, optionTypes)

		const variants = await strapi
			.service('api::product-variant.product-variant')
			.addProductVariants(formattedVariants, optionValues)

		await strapi.service('api::product-image.product-image').addProductImages(data.images, variants)

		const skusInDb = await strapi
			.service('api::sku.sku')
			.addProductSkus(skus, variants)


		await strapi.documents('api::product.product').create({
			data: {
				productId: data.id,
				title: data.title,
				description: data.description,
				basePrice: Math.min(...formattedVariants.map(variant => variant.price)),
				skus: {
					connect: skusInDb,
				},
				variants: {
					connect: variants.map(variant => variant.documentId)
				},
				optionValues: {
					connect: optionValues.map(value => value.documentId),
				},
				optionTypes: {
					connect: optionTypes.map(type => type.documentId)
				},
			},
			fields: 'documentId',
		})
	}
})
)
