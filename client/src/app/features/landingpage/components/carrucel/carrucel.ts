import { Component, AfterViewInit, input } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

@Component({
  selector: 'app-carrucel',
  imports: [],
  templateUrl: './carrucel.html',
  styleUrl: './carrucel.css',
})
export class Carrucel implements AfterViewInit {
  /**
   * *Important -  Hacemos uso de esta implementación para poder manipular el DOM antes de la primera carga inicial.
   */

  public urlImg = input.required<string[]>();
  
  ngAfterViewInit() {
    /*gsap.registerPlugin(ScrollTrigger);
   
    gsap.fromTo('.panel', {
      x:1300, 
      scale:1,
    },{
      ease:"none",
      x:-1500,
      scrollTrigger: {
        trigger: ".wrapper", 
        start: "top 90%", 
        end:"+=1200",
        scrub: 1

      },
    });
   */   
      
  }
}
