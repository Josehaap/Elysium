import { Title } from "@angular/platform-browser";

/**
 * @File Archivo utilizado para mantener la información estática de la landing page.
 * Nos permite tener toda la informaciónn en un sitio específico para que la modifcación se más rápida. 
 */
export const dataLanding = {
  header: {
    urlLogo: 'img/elysium_logo_text.png',
    nav: [{
      title: "Marcas", 
      superLinkSelect: "marcas"
    }, {
      title: "Autónomo", 
      superLinkSelect: "autonomo"
    }],
    btn: {
      title: 'Regístrate',
      urlIcon: 'img/icons/icon-register/register.svg',
    },
  },
  hero: {
    cardConfig: {
      cssConfig: 'flex-row-reverse h-600',
      iWantBtn: false,
    },
    title: '¿Por qué Elysium?',
    description:
      'Elysium es la plataforma que redefine la conexión en el mundo de la moda. Unimos el talento emergente con las oportunidades laborales que fotógrafos, modelos y marcas necesitan para alcanzar su máxima visibilidad. Somos el puente entre tu pasión y tu carrera profesional.',
    urlImg: 'img/img_hero.png',
    textBtn: 'Descubrir más',
  },
  carrucel:{
    firstText: ["Esta plataforma combina a la ","perfección"," de manera"," simbiótica"," las necesidades de ","fotógrafos ","y modelos."],
    urlImg:["/img/img_Carrucel_1.png", "/img/img_Carrucel_2.png", "/img/img_Carrucel_3.png"],
    lastText:"Aunque puedes llegar a vender tus servicios, la plataforma fomenta y apremia a los usuarios que siguen la dinámica de ayuda mutua."
  },
  callAction: {
    title1: 'Únete a la Revolución Creativa',
    urlsImg: [],
    title2: 'Tu futuro empieza aquí',
  },
  oportunitiesSection: {
    cards: [
      {
        cardConfig: {
          cssConfig: '',
          iWantBtn: true,
        },
        title: 'Impulsa tu Formación',
        description:
          'Participa en concursos exclusivos y accede a asesorías profesionales en las instituciones de moda más prestigiosas del país. El conocimiento es tu mejor herramienta.',
        urlImg: 'img/img_oportunitis_1.png',
        textBtn: 'Participar',
      },
      {
        cardConfig: {
          cssConfig: ' flex-row-reverse',
          iWantBtn: true,
        },
        title: 'Hazte un Nombre',
        description:
          'Construye un portfolio profesional que destaque. Conecta con agencias y marcas que buscan exactamente el talento y la frescura que tú ofreces.',
        urlImg: 'img/img_oportunitis_2.png',
        textBtn: 'Crear Portfolio',
      },
      {
        cardConfig: {
          cssConfig: '',
          iWantBtn: false,
        },
        title: 'Materializa tus Ideas',
        description:
          'Transforma tus conceptos creativos en realidades tangibles. Nuestra comunidad te ofrece el soporte y los contactos necesarios para dar el siguiente gran paso.',
        urlImg: 'img/img_oportunitis_1.png',
        textBtn: 'Saber más',
      },
      {
        cardConfig: {
          cssConfig: ' flex-row-reverse',
          iWantBtn: true,
        },
        title: 'Espacio para Empresas',
        description:
          'Si eres una marca o autónomo, este es tu lugar para brillar. Publica tus colecciones, artículos y servicios ante una audiencia apasionada por la moda y el diseño.',
        urlImg: 'img/img_oportunitis_3.png',
        textBtn: 'Registrar Empresa',
      },
    ],
  },
  colaborationSection: {
    title: 'Contamos con las mejores colaboraciones',
    urlsImg:{
      urlBase: "img/logo/logo_", 
      options:['gymshark', 'prada','levis','zara' ,'IDEM'], 
      extension: ".png"
    } ,
    description:
      'Aunque seamos una RED SOCIAL y no podemos gestionar los tratos entre usuarios, Elisyum brinda la oportunidad de llevar acabo dichos tratos a través de sus chats  100% cifradas de punta a punta. ',
  },
  footer: {
    title: '© 2024 Elysium. Todos los derechos reservados. Desarrollado por Jose De Haro Jiménez',
  },
};
