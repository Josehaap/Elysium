export interface responseApiProfilePost{
    Success: boolean; 
    Data: Post[];
    Error:string
}
export interface responseApiProfileData{
    Success: boolean; 
    Data: Data;
    Error:string
}

export interface Post {
    id:string
    title: string;
    img : string;
    description: string;
    likes: number;
    comment: number;
    shared: number;
    userLike: boolean
}

export interface Data {
  user_id: number;
  username: string;
  description_user: string;
  name: string;
  surname: string;
  urlImg: string;
  numberFollower: string;
  numberPublication: string;
  numberFollowed:string
}

export interface ModalProfileData {
  name: string;
  surname:string;
  description_user: string;
  urlImg: string;
  profile_img_file?: File;
  numberFollower?: string
}

export interface UpdateData {
  name: string;
  description_user: string;
  [key: string]: string;
}