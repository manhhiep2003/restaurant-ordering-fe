export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'ADMIN' | 'STAFF' | 'KITCHEN';
  createdAt: string;
  updatedAt: string;
}