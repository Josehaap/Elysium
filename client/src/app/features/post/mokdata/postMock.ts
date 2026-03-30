import{Ipost} from '../models/ipost'
export const posts: Ipost[] = [
  {
    post_id: 1,
    user_id: 101,
    title: "Atardecer en la playa",
    description: "Disfrutando un hermoso atardecer frente al mar.",
    created_at: "2026-02-28T18:45:12Z",
    image_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    visibility: "public",
    type: "image",
    likes_count: 245,
    user: {
      user_id: 101,
      username: "juan_dev",
      full_name: "Juan Pérez",
      avatar_url: "https://i.pravatar.cc/150?img=12"
    }
  },
  {
    post_id: 2,
    user_id: 102,
    title: "Nuevo proyecto en progreso",
    description: "Trabajando en una nueva aplicación web.",
    created_at: "2026-02-27T14:20:05Z",
    image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    visibility: "friends",
    type: "image",
    likes_count: 89,
    user: {
      user_id: 102,
      username: "maria_codes",
      full_name: "María López",
      avatar_url: "https://i.pravatar.cc/150?img=32"
    }
  },
  {
    post_id: 3,
    user_id: 103,
    title: "Reflexión del día",
    description: "La constancia es la clave del éxito.",
    created_at: "2026-02-26T09:10:33Z",
    image_url: null,
    visibility: "private",
    type: "text",
    likes_count: 12,
    user: {
      user_id: 103,
      username: "carlos_write",
      full_name: "Carlos Martínez",
      avatar_url: "https://i.pravatar.cc/150?img=5"
    }
  },
  {
    post_id: 4,
    user_id: 104,
    title: "Vacaciones en la montaña",
    description: "Explorando nuevos caminos y disfrutando la naturaleza.",
    created_at: "2026-02-25T16:55:47Z",
    image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    visibility: "public",
    type: "image",
    likes_count: 321,
    user: {
      user_id: 104,
      username: "ana_travel",
      full_name: "Ana Rodríguez",
      avatar_url: "https://i.pravatar.cc/150?img=47"
    }
  }
];