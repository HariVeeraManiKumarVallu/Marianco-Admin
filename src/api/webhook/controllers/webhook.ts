import fs from 'fs'
import path from 'path'
import util from 'util'

type PrintifyWebhookPayload = {
  id: string
  type: string
  created_at: string
  resource: {
    id: string
    type: string
    data: {
      shop_id: number
      publish_details: {
        title: boolean
        variants: boolean
        description: boolean
        tags: boolean
        images: boolean
        key_features: boolean
        shipping_template: boolean
        shipping_methods: number[]
      }
      action: string
      out_of_stock_publishing: number
      external_sku_mapping: []
    }
  }
}

type ProductData = {
  productId: string
  title: string
  description?: string
  basePrice: number
  variants: string[]
  images: {
    src: string
    variantIds: number[]
    is_default: boolean
  }[]
}

export default {
  async webhook(ctx) {
    // console.log(
    //   'Webhook received:',
    //   util.inspect(ctx.request.body, false, null, true)
    // )
    // console.log({ details: ctx.request.body?.resource?.data?.publish_details })

    // Get the directory of the current module
    // const currentModulePath = path.resolve(__dirname)
    // const logDir = path.join(currentModulePath, '..', '..', '..', '..', 'logs')
    // console.log({ currentModulePath, logDir })

    // if (!fs.existsSync(logDir)) {
    //   fs.mkdirSync(logDir, { recursive: true })
    // }

    // const timestamp = new Date().toISOString().replace(/:/g, '-')
    // const logFilePath = path.join(logDir, `webhook_log_${timestamp}.json`)

    // const logData = {
    //   body: ctx.request.body,
    //   details: ctx.request.body?.data?.publish_details ?? {},
    // title}

    // fs.writeFileSync(logFilePath, JSON.stringify(logData, null, 2), 'utf8')

    try {
      const payload = ctx.request.body as PrintifyWebhookPayload

      // Validate webhook payload
      if (!payload || !payload.resource.data.action) {
        ctx.throw(400, 'Invalid webhook payload')
      }

      console.log(payload)
      // TODO: Validate webhook signature
      // const printifySignature = ctx.request.headers['x-printify-signature']
      // if (!printifySignature) {
      //   ctx.throw(401, 'Unauthorized webhook')
      // }

      switch (payload.resource.data.action) {
        case 'create':
          await addProduct({
            shopId: payload.resource.data.shop_id,
            productId: payload.resource.id,
          })

          ctx.send({ message: 'Product created successfully' }, 200)
          break

        // Create product in Strapi database
        //   const newProduct = await strapi.entityService.create(
        //     'api::product.product',
        //     {
        //       data: productData,
        //     }
        //   )

        //   ctx.send(
        //     {
        //       message: 'Product created successfully',
        //       productId: newProduct.id,
        //     },
        //     200
        //   )
        //   break

        // case 'product.updated':
        // Handle product updates
        // const updatedProduct = await strapi.entityService.update(
        //   'api::product.product',
        //   payload.data.id,
        //   {
        //     data: {
        //       name: payload.data.title,
        //       description: payload.data.description,
        //       basePrice: payload.data.variants?.[0]?.price,
        //       sku: payload.data.variants?.[0]?.sku,
        //     },
        //   }
        // )
        // ctx.send(
        //   {
        //     message: 'Product updated successfully',
        //     productId: updatedProduct.id,
        //   },
        //   200
        // )
        // break

        default:
          strapi.log.info(
            `Unhandled webhook event: ${payload.resource.data.action}`
          )
          ctx.send({ message: 'Webhook received but not processed' }, 202)
      }
    } catch (error) {
      strapi.log.error('Webhook processing error:', error)

      // Handle different types of errors
      if (error instanceof Error) {
        ctx.throw(500, `Webhook processing failed: ${error.message}`)
      } else {
        ctx.throw(500, 'Unexpected error processing webhook')
      }
    }
  },
}

async function addProduct({
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

type ProductResponse = {
  current_page: number
  data: PrintifyProduct
  first_page_url: string
  from: number
  last_page: number
  last_page_url: string
  links: PaginationLink[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number
  total: number
}

export type PrintifyProduct = {
  id: string
  title: string
  description: string
  tags: string[]
  options: PrintifyOption[]
  variants: VariantPrintify[]
  images: ProductImage[]
}

export type PrintifyOption = {
  name: string,
  type: string
  values: {
    id: number
    title: string
    previewUrl?: string
    colors?: string[]
  }[]
}

export type OptionType = {
  name: string,
  type: string
}

export type OptionValue = {
  optionId: number
  title: string
  previewUrl?: string
  colors?: string[]
}

export type Variant = {
  variantId: number
  title: string
  cost: number
  price: number
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  is_printify_express_eligible: boolean
  quantity: number
  options: number[]
}

type VariantPrintify = {
  id: number,
  sku: string
  cost: number
  price: number
  title: string
  grams: number
  is_enabled: boolean
  is_default: boolean
  is_available: boolean
  is_printify_express_eligible: boolean
  quantity: number
  options: number[]
}

export type Sku = {
  skuId: string
  variantId: string
}

export type ProductImage = {
  src: string
  variant_ids: number[]
  position: string
  is_default: boolean
  is_selected_for_publishing: boolean
  order: number | null
}

type PaginationLink = {
  url: string | null
  label: string
  active: boolean
}
