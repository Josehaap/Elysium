export interface SearchPlatformAPIResponse {
    Success: boolean;
    Data: DataUser[];
    Error: string;
}

export interface DataUser{
    username:string;
    profile_img:string
}