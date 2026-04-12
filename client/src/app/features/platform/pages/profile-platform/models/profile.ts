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
    img: string;
    description: string;
    likes: number;
    comment: number;
    shared: number;
    userLike: boolean
}

export interface Data {
    username :string; 
    description_user:string;
    name: string;
    email:string;
    numberFollower: string; 
    numberPublication:string
}
