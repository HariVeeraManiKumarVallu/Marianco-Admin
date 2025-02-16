/**
 * product service
 */

import { factories } from '@strapi/strapi'
import { PrintifyProduct, VariantPrintify } from '../../../../types/printify'

export default factories.createCoreService('api::product.product', ({ strapi }) => ({
	async addProduct({
		shopId,
		productId,
	}: {
		shopId: number
		productId: string
	}) {
		const res = await fetch(
			`${process.env.PRINTIFY_BASE_URL}/shops/${shopId}/products/${productId}.json`,
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


		const product = await strapi.documents('api::product.product').create({
			data: {
				productId: data.id,
				title: data.title,
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
			fields: 'productId',
		})

		if (product.productId) {
			try {
				const response = await fetch(`${process.env.PRINTIFY_BASE_URL}/shops/${process.env.PRINTIFY_SHOP_ID}/products/${product.productId}/publishing_succeeded.json`,
					{
						method: 'POST',
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`
						},
						body: JSON.stringify({
							external: {
								id: product.productId,
								handle: `${process.env.BASE_URL_TO_STORE}/${product.documentId}`
							}
						})
					})

				if (!response.ok) {
					throw new Error(`Error while publishing product in Printify. Status: ${response.status}`);
				}

			} catch (error) {
				console.log((`Error while publishing product in Printify.`))
			}
		} else {
			console.log('Error while creating product. Sending publishing failed to Printify.')

			const response = await fetch(`${process.env.PRINTIFY_BASE_URL}/v1/shops/${process.env.PRINTIFY_SHOP_ID}/products/${product.productId}/publishing_failed.json`,
				{
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${process.env.PRINTIFY_ACCESS_TOKEN}`
					},
					body: JSON.stringify({
						reason: 'Error in Strapi'
					})
				})

			if (!response.ok) {
				console.log(`Error while sending publishing failed response to Printify. Status: ${response.status}`);
			}

		}

	}
})
)

