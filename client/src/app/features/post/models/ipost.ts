export interface Ipost {
  post_id: number;
  user_id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string|null;
  visibility: string;
  type: string;
  likes_count: number;
  user: user;
}

export interface user {
  user_id: number;
  username: string;
  full_name: string;
  avatar_url: string;
}
