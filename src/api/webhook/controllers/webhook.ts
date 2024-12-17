interface PrintifyWebhookPayload {
  event: string
  timestamp: number
  data: {
    id: number
    title: string
    description?: string
    variants?: Array<{
      id: number
      price: number
      sku: string
    }>
    // Add other relevant Printify product fields
  }
}

interface ProductData {
  printifyProductId: number
  name: string
  description?: string
  basePrice?: number
  sku?: string
  // Add other fields specific to your application
}

export default {
  /**
   * Receive and process Printify webhook events
   */
  async webhook(ctx) {
    console.log(ctx.request.body)
    //   try {
    //     // Type assertion for the payload
    //     const payload = ctx.request.body as PrintifyWebhookPayload

    //     // Validate webhook payload
    //     if (!payload || !payload.event) {
    //       ctx.throw(400, 'Invalid webhook payload')
    //     }

    //     // Optional: Add webhook authentication
    //     // You might want to verify a secret token from Printify
    //     const printifySignature = ctx.request.headers['x-printify-signature']
    //     if (!printifySignature) {
    //       // Implement signature verification logic here
    //       // This typically involves checking a shared secret
    //       ctx.throw(401, 'Unauthorized webhook')
    //     }

    //     // Process different webhook event types
    //     switch (payload.event) {
    //       case 'product.created':
    //         // Transform Printify data to your application's product schema
    //         const productData: ProductData = {
    //           printifyProductId: payload.data.id,
    //           name: payload.data.title,
    //           description: payload.data.description,
    //           basePrice: payload.data.variants?.[0]?.price,
    //           sku: payload.data.variants?.[0]?.sku,
    //           // Add any additional transformations or default values
    //         }

    //         // Create product in Strapi database
    //         const newProduct = await strapi.entityService.create(
    //           'api::product.product',
    //           {
    //             data: productData,
    //           }
    //         )

    //         ctx.send(
    //           {
    //             message: 'Product created successfully',
    //             productId: newProduct.id,
    //           },
    //           200
    //         )
    //         break

    //       case 'product.updated':
    //         // Handle product updates
    //         const updatedProduct = await strapi.entityService.update(
    //           'api::product.product',
    //           payload.data.id,
    //           {
    //             data: {
    //               name: payload.data.title,
    //               description: payload.data.description,
    //               basePrice: payload.data.variants?.[0]?.price,
    //               sku: payload.data.variants?.[0]?.sku,
    //             },
    //           }
    //         )
    //         ctx.send(
    //           {
    //             message: 'Product updated successfully',
    //             productId: updatedProduct.id,
    //           },
    //           200
    //         )
    //         break

    //       default:
    //         strapi.log.info(`Unhandled webhook event: ${payload.event}`)
    //         ctx.send({ message: 'Webhook received but not processed' }, 202)
    //     }
    //   } catch (error) {
    //     strapi.log.error('Webhook processing error:', error)

    //     // Handle different types of errors
    //     if (error instanceof Error) {
    //       ctx.throw(500, `Webhook processing failed: ${error.message}`)
    //     } else {
    //       ctx.throw(500, 'Unexpected error processing webhook')
    //     }
    //   }
  },
}
