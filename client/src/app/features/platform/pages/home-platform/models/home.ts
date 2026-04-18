export interface responseApiDashboard {
    profile_img : string;
    dataNewPost: infoDataPost[]
}



export interface infoDataPost{
    post_id: string;
    title: string;
    img_post:string;
    description: string;
    created_at: string;
    user_id: string;
    username: string;
    profile_img: string;
}


export interface ResponseApiNews {
    "status": string;
    "request_id": string;
    "data": DataNews[]
}

export interface DataNews {
    "article_id": string
    "title": string;
    "link": string;
    "snippet": string;
    "photo_url": string;
    "thumbnail_url": string,
    "published_datetime_utc": string,
    "authors": string[] ,
    "source_url": string,
    "source_name": string,
    "source_logo_url": string,
    "source_favicon_url": string,
    "source_publication_id": "CAAqIQgKIhtDQklTRGdnTWFnb0tDR1ZzYkdVdVkyOXRLQUFQAQ",
    "related_topics": [
        {
            "topic_id": string
            "topic_name": string
        }
    ]
}