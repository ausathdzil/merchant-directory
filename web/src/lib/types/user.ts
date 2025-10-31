import type { components, paths } from './schema';

export type User = components['schemas']['UserPublic'];

export type UserResponse =
  paths['/api/v1/users/me']['get']['responses']['200']['content']['application/json'];
