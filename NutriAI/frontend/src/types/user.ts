export interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
}
