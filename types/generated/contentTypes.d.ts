import type { Attribute, Schema } from '@strapi/strapi';

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    description: '';
    displayName: 'Api Token';
    name: 'Api Token';
    pluralName: 'api-tokens';
    singularName: 'api-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    description: '';
    displayName: 'API Token Permission';
    name: 'API Token Permission';
    pluralName: 'api-token-permissions';
    singularName: 'api-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'Permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'Role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    description: '';
    displayName: 'Transfer Token';
    name: 'Transfer Token';
    pluralName: 'transfer-tokens';
    singularName: 'transfer-token';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    expiresAt: Attribute.DateTime;
    lastUsedAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    description: '';
    displayName: 'Transfer Token Permission';
    name: 'Transfer Token Permission';
    pluralName: 'transfer-token-permissions';
    singularName: 'transfer-token-permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'User';
    pluralName: 'users';
    singularName: 'user';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    preferedLanguage: Attribute.String;
    registrationToken: Attribute.String & Attribute.Private;
    resetPasswordToken: Attribute.String & Attribute.Private;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    username: Attribute.String;
  };
}

export interface ApiArticleArticle extends Schema.CollectionType {
  collectionName: 'articles';
  info: {
    displayName: 'Article';
    pluralName: 'articles';
    singularName: 'article';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-api': {
      visible: true;
    };
  };
  attributes: {
    body: Attribute.RichText;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    featuredGridPosition: Attribute.Integer;
    isFeatured: Attribute.Boolean & Attribute.DefaultTo<false>;
    publishedAt: Attribute.DateTime;
    publishedDate: Attribute.Date;
    slug: Attribute.UID<'api::article.article', 'title'> & Attribute.Required;
    summary: Attribute.Text;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::article.article',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiCustomerCustomer extends Schema.CollectionType {
  collectionName: 'customers';
  info: {
    description: '';
    displayName: 'Customer';
    pluralName: 'customers';
    singularName: 'customer';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    address1: Attribute.String;
    address2: Attribute.String;
    city: Attribute.String;
    country: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.String;
    name: Attribute.String;
    order: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'api::order.order'
    >;
    phone: Attribute.String;
    region: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::customer.customer',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    zip: Attribute.String;
  };
}

export interface ApiDonationDonation extends Schema.CollectionType {
  collectionName: 'donations';
  info: {
    displayName: 'Donation';
    pluralName: 'donations';
    singularName: 'donation';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-api': {
      visible: true;
    };
  };
  attributes: {
    amount: Attribute.Integer;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::donation.donation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    currency: Attribute.String;
    email: Attribute.Email & Attribute.Required;
    paymentId: Attribute.String;
    planId: Attribute.String;
    subscriptionId: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::donation.donation',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEventAttendeeEventAttendee extends Schema.CollectionType {
  collectionName: 'event_attendees';
  info: {
    description: '';
    displayName: 'Event Attendee';
    pluralName: 'event-attendees';
    singularName: 'event-attendee';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    city: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::event-attendee.event-attendee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email & Attribute.Required;
    event: Attribute.Relation<
      'api::event-attendee.event-attendee',
      'oneToOne',
      'api::event.event'
    >;
    name: Attribute.String & Attribute.Required;
    organization: Attribute.String;
    participants: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      > &
      Attribute.DefaultTo<1>;
    publishedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::event-attendee.event-attendee',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiEventEvent extends Schema.CollectionType {
  collectionName: 'events';
  info: {
    displayName: 'Event';
    pluralName: 'events';
    singularName: 'event';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-api': {
      visible: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::event.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    endDate: Attribute.DateTime;
    isPastEvent: Attribute.Boolean & Attribute.DefaultTo<false>;
    location: Attribute.String;
    name: Attribute.String & Attribute.Required;
    publishedAt: Attribute.DateTime;
    slug: Attribute.UID<'api::event.event', 'name'> & Attribute.Required;
    startDate: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::event.event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiNewsletterNewsletter extends Schema.CollectionType {
  collectionName: 'newsletters';
  info: {
    displayName: 'Newsletter';
    pluralName: 'newsletters';
    singularName: 'newsletter';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-api': {
      visible: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::newsletter.newsletter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email & Attribute.Required & Attribute.Unique;
    isSubscribed: Attribute.Boolean & Attribute.DefaultTo<true>;
    mailchimpStatus: Attribute.String;
    source: Attribute.String & Attribute.DefaultTo<'web'>;
    subscribedAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::newsletter.newsletter',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrderItemOrderItem extends Schema.CollectionType {
  collectionName: 'order_items';
  info: {
    description: '';
    displayName: 'Order Item';
    pluralName: 'order-items';
    singularName: 'order-item';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::order-item.order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    currency: Attribute.Enumeration<['SEK', 'USD', 'EUR']> &
      Attribute.Required &
      Attribute.DefaultTo<'SEK'>;
    order: Attribute.Relation<
      'api::order-item.order-item',
      'manyToOne',
      'api::order.order'
    >;
    price: Attribute.Integer;
    quantity: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    sku: Attribute.Relation<
      'api::order-item.order-item',
      'manyToOne',
      'api::sku.sku'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::order-item.order-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiOrderOrder extends Schema.CollectionType {
  collectionName: 'orders';
  info: {
    description: '';
    displayName: 'Order';
    pluralName: 'orders';
    singularName: 'order';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    currency: Attribute.Enumeration<['SEK', 'USD', 'EUR']> &
      Attribute.Required &
      Attribute.DefaultTo<'USD'>;
    customer: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'api::customer.customer'
    >;
    isPaid: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<false>;
    orderItems: Attribute.Relation<
      'api::order.order',
      'oneToMany',
      'api::order-item.order-item'
    >;
    orderNumber: Attribute.Integer &
      Attribute.Unique &
      Attribute.SetMinMax<
        {
          min: 100000;
        },
        number
      >;
    shippingCost: Attribute.Integer;
    stripePaymentId: Attribute.String & Attribute.Private;
    totalPrice: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::order.order',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductCategoryProductCategory
  extends Schema.CollectionType {
  collectionName: 'product_categories';
  info: {
    description: '';
    displayName: 'Product Category';
    pluralName: 'product-categories';
    singularName: 'product-category';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-category.product-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    products: Attribute.Relation<
      'api::product-category.product-category',
      'oneToMany',
      'api::product.product'
    >;
    publishedAt: Attribute.DateTime;
    title: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product-category.product-category',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductImageProductImage extends Schema.CollectionType {
  collectionName: 'product_images';
  info: {
    description: '';
    displayName: 'Product Image';
    pluralName: 'product-images';
    singularName: 'product-image';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-image.product-image',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    isDefault: Attribute.Boolean & Attribute.DefaultTo<false>;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product-image.product-image',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    variants: Attribute.Relation<
      'api::product-image.product-image',
      'manyToMany',
      'api::product-variant.product-variant'
    >;
  };
}

export interface ApiProductOptionTypeProductOptionType
  extends Schema.CollectionType {
  collectionName: 'product_option_types';
  info: {
    description: '';
    displayName: 'Product Option Type';
    pluralName: 'product-option-types';
    singularName: 'product-option-type';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-option-type.product-option-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    optionValues: Attribute.Relation<
      'api::product-option-type.product-option-type',
      'oneToMany',
      'api::product-option-value.product-option-value'
    >;
    products: Attribute.Relation<
      'api::product-option-type.product-option-type',
      'manyToMany',
      'api::product.product'
    >;
    type: Attribute.String & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product-option-type.product-option-type',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface ApiProductOptionValueProductOptionValue
  extends Schema.CollectionType {
  collectionName: 'product_options_value';
  info: {
    description: '';
    displayName: 'Product Option Value';
    pluralName: 'product-option-values';
    singularName: 'product-option-value';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    color: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    optionId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    optionType: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'manyToOne',
      'api::product-option-type.product-option-type'
    >;
    previewUrl: Attribute.String;
    products: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'manyToMany',
      'api::product.product'
    >;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    variants: Attribute.Relation<
      'api::product-option-value.product-option-value',
      'manyToMany',
      'api::product-variant.product-variant'
    >;
  };
}

export interface ApiProductVariantProductVariant extends Schema.CollectionType {
  collectionName: 'product_variants';
  info: {
    description: '';
    displayName: 'Product Variant';
    pluralName: 'product-variants';
    singularName: 'product-variant';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    cost: Attribute.Integer &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product-variant.product-variant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    images: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToMany',
      'api::product-image.product-image'
    >;
    isAvailable: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    isDefault: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    isEnabled: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    options: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToMany',
      'api::product-option-value.product-option-value'
    >;
    price: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    products: Attribute.Relation<
      'api::product-variant.product-variant',
      'manyToMany',
      'api::product.product'
    >;
    skus: Attribute.Relation<
      'api::product-variant.product-variant',
      'oneToMany',
      'api::sku.sku'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product-variant.product-variant',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    variantId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    weight: Attribute.Integer &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
  };
}

export interface ApiProductProduct extends Schema.CollectionType {
  collectionName: 'products';
  info: {
    description: '';
    displayName: 'Product';
    pluralName: 'products';
    singularName: 'product';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    basePrice: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.Blocks;
    isArchived: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    optionTypes: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product-option-type.product-option-type'
    >;
    optionValues: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product-option-value.product-option-value'
    >;
    productCategory: Attribute.Relation<
      'api::product.product',
      'manyToOne',
      'api::product-category.product-category'
    >;
    productId: Attribute.String & Attribute.Required & Attribute.Unique;
    publishedAt: Attribute.DateTime;
    shortDescription: Attribute.String;
    skus: Attribute.Relation<
      'api::product.product',
      'oneToMany',
      'api::sku.sku'
    >;
    title: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::product.product',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    variants: Attribute.Relation<
      'api::product.product',
      'manyToMany',
      'api::product-variant.product-variant'
    >;
  };
}

export interface ApiSkuSku extends Schema.CollectionType {
  collectionName: 'skus';
  info: {
    description: '';
    displayName: 'SKU';
    pluralName: 'skus';
    singularName: 'sku';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'api::sku.sku', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    order_items: Attribute.Relation<
      'api::sku.sku',
      'oneToMany',
      'api::order-item.order-item'
    >;
    product: Attribute.Relation<
      'api::sku.sku',
      'manyToOne',
      'api::product.product'
    >;
    skuId: Attribute.String & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<'api::sku.sku', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    variant: Attribute.Relation<
      'api::sku.sku',
      'manyToOne',
      'api::product-variant.product-variant'
    >;
  };
}

export interface ApiSponsorSponsor extends Schema.CollectionType {
  collectionName: 'sponsors';
  info: {
    displayName: 'Sponsor';
    pluralName: 'sponsors';
    singularName: 'sponsor';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-api': {
      visible: true;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::sponsor.sponsor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    logo: Attribute.Media;
    name: Attribute.String & Attribute.Required;
    tier: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::sponsor.sponsor',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    website: Attribute.String;
  };
}

export interface ApiTeamMemberTeamMember extends Schema.CollectionType {
  collectionName: 'team_members';
  info: {
    displayName: 'Team Member';
    pluralName: 'team-members';
    singularName: 'team-member';
  };
  options: {
    draftAndPublish: true;
  };
  pluginOptions: {
    'content-api': {
      visible: true;
    };
  };
  attributes: {
    bio: Attribute.Text;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'api::team-member.team-member',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    hierarchy: Attribute.Integer & Attribute.Required & Attribute.Unique;
    image: Attribute.Media<'images'>;
    name: Attribute.String & Attribute.Required;
    publishedAt: Attribute.DateTime;
    role: Attribute.String & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'api::team-member.team-member',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesRelease extends Schema.CollectionType {
  collectionName: 'strapi_releases';
  info: {
    displayName: 'Release';
    pluralName: 'releases';
    singularName: 'release';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    actions: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToMany',
      'plugin::content-releases.release-action'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String & Attribute.Required;
    releasedAt: Attribute.DateTime;
    scheduledAt: Attribute.DateTime;
    status: Attribute.Enumeration<
      ['ready', 'blocked', 'failed', 'done', 'empty']
    > &
      Attribute.Required;
    timezone: Attribute.String;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginContentReleasesReleaseAction
  extends Schema.CollectionType {
  collectionName: 'strapi_release_actions';
  info: {
    displayName: 'Release Action';
    pluralName: 'release-actions';
    singularName: 'release-action';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    contentType: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    entry: Attribute.Relation<
      'plugin::content-releases.release-action',
      'morphToOne'
    >;
    isEntryValid: Attribute.Boolean;
    locale: Attribute.String;
    release: Attribute.Relation<
      'plugin::content-releases.release-action',
      'manyToOne',
      'plugin::content-releases.release'
    >;
    type: Attribute.Enumeration<['publish', 'unpublish']> & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::content-releases.release-action',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    collectionName: 'locales';
    description: '';
    displayName: 'Locale';
    pluralName: 'locales';
    singularName: 'locale';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    name: Attribute.String &
      Attribute.SetMinMax<
        {
          max: 50;
          min: 1;
        },
        number
      >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    description: '';
    displayName: 'File';
    pluralName: 'files';
    singularName: 'file';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    alternativeText: Attribute.String;
    caption: Attribute.String;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    ext: Attribute.String;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    height: Attribute.Integer;
    mime: Attribute.String & Attribute.Required;
    name: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    size: Attribute.Decimal & Attribute.Required;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    url: Attribute.String & Attribute.Required;
    width: Attribute.Integer;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    displayName: 'Folder';
    pluralName: 'folders';
    singularName: 'folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    description: '';
    displayName: 'Permission';
    name: 'permission';
    pluralName: 'permissions';
    singularName: 'permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    description: '';
    displayName: 'Role';
    name: 'role';
    pluralName: 'roles';
    singularName: 'role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    description: Attribute.String;
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    type: Attribute.String & Attribute.Unique;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    description: '';
    displayName: 'User';
    name: 'user';
    pluralName: 'users';
    singularName: 'user';
  };
  options: {
    draftAndPublish: false;
    timestamps: true;
  };
  attributes: {
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    resetPasswordToken: Attribute.String & Attribute.Private;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    updatedAt: Attribute.DateTime;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::permission': AdminPermission;
      'admin::role': AdminRole;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'admin::user': AdminUser;
      'api::article.article': ApiArticleArticle;
      'api::customer.customer': ApiCustomerCustomer;
      'api::donation.donation': ApiDonationDonation;
      'api::event-attendee.event-attendee': ApiEventAttendeeEventAttendee;
      'api::event.event': ApiEventEvent;
      'api::newsletter.newsletter': ApiNewsletterNewsletter;
      'api::order-item.order-item': ApiOrderItemOrderItem;
      'api::order.order': ApiOrderOrder;
      'api::product-category.product-category': ApiProductCategoryProductCategory;
      'api::product-image.product-image': ApiProductImageProductImage;
      'api::product-option-type.product-option-type': ApiProductOptionTypeProductOptionType;
      'api::product-option-value.product-option-value': ApiProductOptionValueProductOptionValue;
      'api::product-variant.product-variant': ApiProductVariantProductVariant;
      'api::product.product': ApiProductProduct;
      'api::sku.sku': ApiSkuSku;
      'api::sponsor.sponsor': ApiSponsorSponsor;
      'api::team-member.team-member': ApiTeamMemberTeamMember;
      'plugin::content-releases.release': PluginContentReleasesRelease;
      'plugin::content-releases.release-action': PluginContentReleasesReleaseAction;
      'plugin::i18n.locale': PluginI18NLocale;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
    }
  }
}
