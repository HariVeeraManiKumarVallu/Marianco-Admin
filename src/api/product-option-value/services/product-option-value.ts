/**
 * product-option service
 */

import { factories } from '@strapi/strapi'
import { OptionType, PrintifyOption, } from '../../webhook/controllers/webhook'
import util from 'util'

export default factories.createCoreService(
  'api::product-option-value.product-option-value',
  ({ strapi }) => ({
    async addProductOptions(productOptions: PrintifyOption[], optionTypes: (OptionType & { documentId: string })[]) {

      const optionTypesMap = new Map()
      optionTypes.forEach(t => optionTypesMap.set(t.type, t.documentId))

      const formattedOptions = productOptions.flatMap(option =>
        option.values.map(value => option.type === 'color' ? {
          optionId: value.id,
          type: option.type,
          title: value.title,
          color: value?.colors[0],
          previewUrl: value?.previewUrl
        } : {
          optionId: value.id,
          type: option.type,
          title: value.title,
        })
      )
      const optionIds = formattedOptions.map(option => option.optionId)

      try {
        const existingOptions = await strapi
          .documents('api::product-option-value.product-option-value')
          .findMany({
            filters: {
              optionId: {
                $in: optionIds,
              },
            },
            fields: 'optionId',
          })

        if (existingOptions.length === 0) {
          const createdOptions = await Promise.all(createOptions(formattedOptions, optionTypesMap))
          return createdOptions
        }

        const existingOptionIds = new Set(
          existingOptions.map(opt => opt.optionId)
        )

        const newOptions = formattedOptions.filter(
          option => !existingOptionIds.has(option.optionId)
        )

        if (newOptions.length > 0) {
          const createdOptions = await Promise.all(createOptions(newOptions, optionTypesMap))
          return [...existingOptions, ...createdOptions]
        }

        return existingOptions

      }
      catch (error) {
        console.log(error.details.errors)
      }


    },
  })
)

function createOptions(options: {
  optionId: number;
  type: string;
  title: string;
  color?: string;
  previewUrl?: string;
}[], optionTypesMap: Map<string, string>) {

  console.log(util.inspect({ options, optionTypesMap }, false, null, true))

  return options.map(({ type, ...option }) =>
    strapi.documents('api::product-option-value.product-option-value').create({
      data: {
        ...option,
        optionType: {
          connect: optionTypesMap.get(type)
        },
      },
      fields: 'optionId',
    })
  )
}
