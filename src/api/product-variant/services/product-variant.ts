/**
 * product-variant service
 */

import { Data, factories } from '@strapi/strapi'
import { off } from 'process'
import { Variant } from '../../webhook/controllers/webhook'

export default factories.createCoreService(
  'api::product-variant.product-variant',
  ({ strapi }) => ({
    async addProductVariants(productVariants: Variant[]) {
      const formattedVariants = productVariants
        .filter(v => v.is_enabled)
        .map(
          ({ is_printify_express_eligible, cost, title, id, ...variant }) => ({
            ...variant,
            variantId: id.toString(),
          })
        )
      console.log(formattedVariants)
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
        const cv = await Promise.all(
          formattedVariants.map(variant =>
            strapi.documents('api::product-variant.product-variant').create({
              data: variant,
              fields: 'documentId',
            })
          )
        )
        return console.log(cv)
      }

      const existingVariantIds = new Set(
        existingVariants.map(variant => variant.variantId)
      )

      // const newOptions = formattedOptions.filter(
      //   option => !existingOptionIds.has(option.optionId)
      // )

      // if (newOptions.length > 0) {
      // const createdOptions = await Promise.all(
      //   newOptions.map(option =>
      //     strapi.documents('api::product-option.product-option').create({
      //       data: option,
      //       fields: 'optionId',
      //     })
      //   )
      // )

      // return [...existingOptions, ...createdOptions]
      // }

      // return existingOptions
    },
  })
)
