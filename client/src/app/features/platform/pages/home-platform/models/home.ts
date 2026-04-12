export interface responseApiDashboard {
    profile_img : string;
    dataNewPost: infoDataPost[]
}



export interface infoDataPost{
    post_id: string;
    title: string;
    description: string;
    created_at: string;
    user_id: string;
    username: string;
    profile_img: string;
}