export default interface ISectionMarca {
    title:string;
    urlsImg: UrlsImg;
    description:string;
      
}

interface UrlsImg{
    urlBase: string;
    options:string[];
    extension: string
}