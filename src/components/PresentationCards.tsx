import { type Component } from "solid-js";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import PresentationCardWhois from "./PresentationCardWhois";

/**
 * Les cartes de présentation des membres de l'OEIL.
 * 
 * Chaque carte contient une photo, le nom et le prénom du membre,
 * son rôle au sein de l'OEIL, et une courte description.
 * 
 * Elles defilent automatiquement en scrollant tout en restant
 * figées au milieu de la page.
 */
const PresentationCards: Component = () => {
  const animation = (element: HTMLElement) => {
    gsap.registerPlugin(ScrollTrigger);

    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: "top top",
        end: "bottom top",
        scrub: true,
        markers: false,
        toggleActions: "play reverse play reverse",
      }
    });
    
    tl1
      .to(element, { opacity: 1, duration: 0.75 })
      .to(element, { opacity: 0, duration: 0.25 }, 1)
    ;
  }
  
  return (
    <section class="bg-black min-h-screen h-full relative pt-40vh">
      <h2 class="text-white mb-10vh text-3xl font-mono text-center">
        # Les membres
      </h2>

      {/* @ts-ignore */}
      <div use:animation class="flex justify-center items-center sticky top-0 h-screen pt-24 pb-8 opacity-0">
        <div class="flex flex-col gap-8 h-full relative w-full">
          <h3 class="text-white text-center tracking-wider text-2xl md:text-5xl uppercase font-600">
            Trésorerie
          </h3>

          <div class="h-full overflow-auto w-fit mx-auto relative sm:shadow-[-8px_8px_0_#fff] sm:border-4 border-white">
            <img
              class="z-10 h-full mx-auto"
              src="/TRESORERIE.png"
            />

            <PresentationCardWhois name="Noah TILLEUIL" role="Vice Trésorier" left={12} />
            <PresentationCardWhois name="Evan GERBEAUD" role="Trésorier" right={12} />
          </div>
          
        </div>
      </div>

      {/* @ts-ignore */}
      <div use:animation class="flex justify-center items-center sticky top-0 h-screen pt-24 pb-8 opacity-0">
        <div class="flex flex-col gap-8 h-full relative w-full">
          <h3 class="text-white text-center tracking-wider text-2xl md:text-5xl uppercase font-600">
            Communication
          </h3>

          <div class="h-full overflow-auto w-fit mx-auto relative sm:shadow-[-8px_8px_0_#fff] sm:border-4 border-white">
            <img
              class="z-10 h-full mx-auto"
              src="/COMMUNICATION.png"
            />

            <PresentationCardWhois name="Cathy DESCOUTURES" role="Responsable événement et communication" center />
          </div>
          
        </div>
      </div>


      <div class="bg-gradient-to-b from-transparent to-black z-30 h-100vh"/>
    </section>
  );
};

export default PresentationCards;
