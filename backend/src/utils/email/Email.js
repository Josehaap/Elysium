import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); 
import fs from 'fs';
import { get } from 'http';
import path from 'path';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//TODO utilizar herramienta de archivos para enviar arcchivos html con una estructura determinada. 
/**
 * @description Clase Singleton que gestiona el envío de correos transaccionales a través de Brevo (ex Sendinblue).
 * Solo se crea una instancia de la API para toda la aplicación.
 */
export default class Email {
  
  static pathHtmlTemplate = 'template';

  static #transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.userSenderEmail, 
      pass: process.env.apiKeyUserSenderEmail, 
    },
  });

  static #configEmail = {
      from: `"Elysium Enterprise" <${'elysiumEnterpriseNorepeat.org'}>`,
      to: "",
      subject: "",
      html: "",
    }

  /**
   * Envía un correo transaccional.
   * @param {string} toEmail - Email del destinatario
   * @param {string} toName - Nombre del destinatario
   * @param {string} subject - Asunto del correo
   * @param {object} htmlConfig - Objeto literal donde indicamos el tipo de usuario (Normal o Enterprise )y nombre del archivo a enviar con su extension. 
   */
  static async sendEmail(toEmail, subject, htmlConfig) {
    this.#configEmail.to = toEmail; 
    this.#configEmail.subject = subject
    this.#configEmail.html = this.getHtml(htmlConfig.type, htmlConfig.nameFile, htmlConfig.token);

    try {
      const info = await this.#transport.sendMail(this.#configEmail);
      console.log("Correo enviado:", info.messageId);
    } catch (error) {
      console.error("Error al enviar el correo:", error);
      
    }  
  }

  static getHtml(typeUser, nameFile, token){
    let user = typeUser.toLowerCase() ==="normal"? "acountsNormal" : "acountsEnterprise";
    const templateUrl = path.join(__dirname, this.pathHtmlTemplate, user, nameFile); 
    console.log(templateUrl)
    let baseUrl = typeUser.toLowerCase() === 'normal'
      ? process.env.urlUserNormal
      : process.env.urlUserEnterprise;

    const finalActivationUrl = `${baseUrl}/user/userActivation?token=${token}`;
    let html =  fs.readFileSync(templateUrl, 'utf-8').replace(/{{ACTIVATION_LINK}}/g, finalActivationUrl);
  
    return html;
  }

}
