export interface ResponseCommmentAPI {
    Success: boolean;
    Data: IMessage[]; 
    Error:string;
}
export interface IMessage {
    comment_id: number;
    profile_img: string;
    username:string; 
    message:string;
}

export enum CommentAction {
    ADDED = 'ADDED',
    DELETED = 'DELETED',
    CLOSED = 'CLOSED'
}

export interface CommentEvent {
    action: CommentAction;
    commentId?: number;
    message?: string;
    isClosed?: boolean;
}
