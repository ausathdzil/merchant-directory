import type { components, paths } from './schema';

export type MerchantListItem = components['schemas']['MerchantListItem'];

export type PaginationMeta = components['schemas']['PaginationMeta'];

export type MerchantsQuery =
  paths['/api/v1/merchants']['get']['parameters']['query'];

export type MerchantsResponse =
  paths['/api/v1/merchants']['get']['responses']['200']['content']['application/json'];

export type MerchantsError =
  paths['/api/v1/merchants']['get']['responses']['422']['content']['application/json'];
