export interface INavOption {
  title: string;
  superLinkSelect: string;
}

export interface IHeader {
  urlLogo: string;
  nav: INavOption[];
  btn: {
    title: string;
    urlIcon: string;
  };
}
