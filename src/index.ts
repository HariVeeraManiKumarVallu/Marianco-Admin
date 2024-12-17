// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/* { strapi }: { strapi: Core.Strapi } */) {
    // for (let i = 0; i < 30; i++) {
    //   const categories = [
    //     { title: 't-shirt', id: 1 },
    //     { title: 'hoodie', id: 3 },
    //     { title: 'notebook', id: 11 },
    //     { title: 'pin', id: 7 },
    //     { title: 'tote', id: 5 },
    //     { title: 'water bottle', id: 9 },
    //   ]
    //   categories.forEach(async category => {
    //     await strapi.documents('api::product.product').create({
    //       data: {
    //         title: `${category.title} - ${i}`,
    //         price: 25 + i,
    //         product_category: {
    //           id: category.id,
    //         },
    //       },
    //       status: 'published',
    //     })
    //   })
    // }
  },
}
