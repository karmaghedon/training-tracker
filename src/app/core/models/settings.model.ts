export interface AppSettings {
  id: string;
  weightUnit: 'lb' | 'kg';
  theme: 'light' | 'dark';
  defaultRestSeconds: number;
  createdAt: Date;
  updatedAt: Date;
}
