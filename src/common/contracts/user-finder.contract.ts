export const USER_FINDER = Symbol('USER_FINDER');

export interface UserFinderResult {
  id: string;
  email: string;
  name: string;
}

export interface IUserFinder {
  findById(id: string, authHeader?: string): Promise<UserFinderResult | null>;
}
