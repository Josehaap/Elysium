
/**
 * Interfaz de datos que se utilizará para mapear los datos del formulario de registro. 
 */
export interface UserRegister {
  surnames: string;
  email: string;
  iAmEnterprise: boolean;
  first_name: string;
  password: string;
  profile_img: File | null;
  username: string
  
}

/*INterfaz que nos permitirá recibir cierta información*/
export interface UserExistsResponse {
  Success : boolean; //Si la petición se ha realizado correctamente
  Data: ExistsData | ExistsDataLogin; //Datos esperados //*Aquí son dos ya que se encarga de recibir tanto datos de validacion y despues de login
  Error: string //Mensaje de error si por algun casual ha habido un error. 
}
//*Primera interfaz de datos recibidos, recibirimos si el usuario existe o no y su email. 
export interface ExistsData {
  exists: boolean;
  email: string, 
  iAmEnterprise: boolean
}

//*Cuando ahgamos login el backend nos responderá con si es válido el login y si lo fuese con su id, username y la url de su foto de perfil. 
export interface ExistsDataLogin {
  isValid: boolean;
  accessToken: string;
  refreshToken: string
}

/*Interfaz de datos para mapear los datos que se recogerán desde el login */
export interface UserLogin {
  userIdentification: string ;
  password: string
}


interface refreshToken{
  id:string
}

