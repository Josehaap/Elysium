import { Component, inject } from '@angular/core';
import { Carrucel } from '../../components/carrucel/carrucel';
import { ListCard } from '../../components/list-card/list-card';
import { Hero } from '../../components/hero/hero';
import { Header } from '../../components/header/header';
import { dataLanding } from '../../data/dataLandingPage';
import { Login } from '../login/login';
import { Footer } from '../../../shared/footer/footer';
import { SectionMarcas } from '../../components/section-marcas/section-marcas';
@Component({
  selector: 'app-home',
  imports: [Header, Hero, ListCard, Carrucel, Footer, SectionMarcas],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  //*Extraemos los datos de nuestro archivo data. 

  protected dataHeader = dataLanding.header
  protected dataHero = dataLanding.hero;
  protected dataCarrucel = dataLanding.carrucel;
  protected dataCallAction = dataLanding.callAction;
  protected dataOportunities = dataLanding.oportunitiesSection;
  protected dataColaboration = dataLanding.colaborationSection;
  protected dataFooter = dataLanding.footer;


  
}
