import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config(); 

//TODO utilizar herramienta de archivos para enviar arcchivos html con una estructura determinada. 
/**
 * @description Clase Singleton que gestiona el envío de correos transaccionales a través de Brevo (ex Sendinblue).
 * Solo se crea una instancia de la API para toda la aplicación.
 */
export default class Email {
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
      html: "<strong>Hola, este es un correo real con HTML!</strong>",
    }

  /**
   * Envía un correo transaccional.
   * @param {string} toEmail - Email del destinatario
   * @param {string} toName - Nombre del destinatario
   * @param {string} subject - Asunto del correo
   * @param {string} htmlContent - Contenido HTML del correo
   */
  static async sendEmail(toEmail, subject, htmlContentReference) {
    this.#configEmail.to = toEmail; 
    this.#configEmail.subject = subject
    try {
    const info = await this.#transport.sendMail();
    console.log("Correo enviado:", info.messageId);
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    
  }
}

}
