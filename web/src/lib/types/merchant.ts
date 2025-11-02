import type { components, paths } from './schema';

export type MerchantListItem = components['schemas']['MerchantListItem'];

export type PaginationMeta = components['schemas']['PaginationMeta'];

export type MerchantDetail = components['schemas']['MerchantDetail'];

export type MerchantsQuery =
  paths['/api/v1/merchants']['get']['parameters']['query'];

export type MerchantsResponse =
  paths['/api/v1/merchants']['get']['responses']['200']['content']['application/json'];

export type MerchantsError =
  paths['/api/v1/merchants']['get']['responses']['422']['content']['application/json'];

export type MerchantTypesResponse =
  paths['/api/v1/merchants/types']['get']['responses']['200']['content']['application/json'];

export type MerchantPath =
  paths['/api/v1/merchants/{merchant_id}']['get']['parameters']['path'];

export type MerchantResponse =
  paths['/api/v1/merchants/{merchant_id}']['get']['responses']['200']['content']['application/json'];

export type MerchantError =
  paths['/api/v1/merchants/{merchant_id}']['get']['responses']['422']['content']['application/json'];
