export interface Table {
  id: string;
  name: string;
  status: 'AVAILABLE' | 'OCCUPIED';
  capacity: number;
}