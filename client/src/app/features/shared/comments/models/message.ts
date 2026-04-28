export interface ResponseCommmentAPI {
    Success: boolean;
    Data: IMessage[]; 
    Error:string;
}
export interface IMessage {
    profile_img: string;
    username:string; 
    message:string;
}
