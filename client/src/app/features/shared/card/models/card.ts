export interface ICard {
    cardConfig:{
        cssConfig:string, 
        iWantBtn: boolean, 
    },
    title: string,
    description:string,
    urlImg: string,
    textBtn: string | null
}
