/**
 * product-variant service
 */

import { factories } from '@strapi/strapi'
import { Variant } from '../../webhook/controllers/webhook'

export default factories.createCoreService(
  'api::product-variant.product-variant',
  ({ strapi }) => ({
    async addProductVariants(
      productVariants: Variant[],
      productOptions: { id: number; documentId: string; optionId: string }[]
    ) {
      const optionsMap = new Map()

      for (const option of productOptions) {
        optionsMap.set(option.optionId, option.documentId)
      }

      const formattedVariants = productVariants
        .filter(v => v.is_enabled)
        .map(
          ({
            is_printify_express_eligible,
            cost,
            title,
            id,
            grams,
            ...variant
          }) => ({
            ...variant,
            variantId: id.toString(),
            weight: grams,
          })
        )
      const variantIds = formattedVariants.map(variant => variant.variantId)

      const existingVariants = await strapi
        .documents('api::product-variant.product-variant')
        .findMany({
          filters: {
            variantId: {
              $in: variantIds,
            },
          },
          fields: 'variantId',
        })

      if (existingVariants.length === 0) {
        const addedVariants = await Promise.all(
          createProductVariantsDb(formattedVariants, optionsMap)
        )
        return addedVariants.map(variant => variant.documentId)
      }

      const existingVariantIds = new Set(
        existingVariants.map(variant => variant.variantId)
      )

      const newVariants = formattedVariants.filter(
        variant => !existingVariantIds.has(variant.variantId)
      )

      if (newVariants.length > 0) {
        const addedVariants = await Promise.all(
          createProductVariantsDb(newVariants, optionsMap)
        )
        return [...existingVariants, ...addedVariants].map(
          variant => variant.documentId
        )
      }

      return existingVariants.map(variant => variant.documentId)
    },
  })
)

function createProductVariantsDb(
  variants: any[],
  optionsMap: Map<string, string>
) {
  return variants.map(({ options, ...variant }) =>
    strapi.documents('api::product-variant.product-variant').create({
      data: {
        ...variant,
        options: {
          connect: options.map(o => optionsMap.get(String(o))),
        },
      },
      fields: 'documentId',
    })
  )
}
