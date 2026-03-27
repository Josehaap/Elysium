import * as Brevo from '@getbrevo/brevo';

/**
 * @description Clase Singleton que gestiona el envío de correos transaccionales a través de Brevo (ex Sendinblue).
 * Solo se crea una instancia de la API para toda la aplicación.
 */
export default class Gmail {
    static #instance = null;
    #apiClient;

    constructor() {
        if (Gmail.#instance) return Gmail.#instance;

        // Creamos la instancia correctamente con new
        this.#apiClient = new Brevo.TransactionalEmailsApi();

        // Leemos la API key desde las variables de entorno
        this.#apiClient.setApiKey(
            Brevo.TransactionalEmailsApiApiKeys.apiKey,
            process.env.GMAILAPIKEY
        );

        Gmail.#instance = this;
    }

    /**
     * Envía un correo transaccional.
     * @param {string} toEmail - Email del destinatario
     * @param {string} toName - Nombre del destinatario
     * @param {string} subject - Asunto del correo
     * @param {string} htmlContent - Contenido HTML del correo
     */
    async sendEmail(toEmail, toName, subject, htmlContent) {
        const email = new Brevo.SendSmtpEmail();

        email.subject = subject;
        email.to = [{ email: toEmail, name: toName }];
        email.sender = { name: 'Elysium', email: 'no-reply@elysium.com' };
        email.htmlContent = htmlContent;

        return this.#apiClient.sendTransacEmail(email);
    }
}
