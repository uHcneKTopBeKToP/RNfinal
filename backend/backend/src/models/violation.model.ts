export interface Violation {
  id?: number;
  description: string;
  category: string;
  photo_url?: string;
  latitude?: number;
  longitude?: number;
  date_time: string;
  user_id?: number;
}
