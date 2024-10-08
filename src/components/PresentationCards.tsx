import { createEffect, onCleanup, type Component, type ParentComponent } from "solid-js";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import PresentationCardWhois from "./PresentationCardWhois";
import { createMediaQuery } from "@solid-primitives/media";

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
  const Section: ParentComponent<{ title: string, image: string }> = (props) => {
    const isMobile = createMediaQuery("(max-width: 640px)", true);

    const animation = (element: HTMLDivElement) => {
      gsap.registerPlugin(ScrollTrigger);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top top",
          end: "bottom top",
          scrub: true,
          // markers: true,
          pin: true,
          pinSpacing: false,
          toggleActions: "play reverse play reverse",
        }
      });

      let tween: gsap.core.Timeline;

      createEffect(() => {
        tween = timeline
          .from(element, {
            rotate: isMobile() ? 0 : 3,
            y: 220,
            opacity: 0,
          })
          .to(element, {
            rotate: 0,
            y: 0,
            opacity: 1,
            duration: 0.5,
            ease: "power2.inOut"
          })
          .to(element, {
            rotate: isMobile() ? 0 : -7,
            y: -240,
            opacity: 0,
            duration: 1,
            ease: "power2.inOut",
          }, 1)

        onCleanup(() => {
          timeline.remove(tween);
        });
      })
    }

    return (
      // @ts-ignore
      <div use:animation class="-mt-8 flex justify-center items-center top-0 h-screen pt-32 sm:pt-24 pb-8 overflow-x-hidden">
        <div class="flex flex-col gap-8 h-full relative w-full">
          <h3 class="text-white text-center tracking-wider text-2xl md:text-5xl uppercase font-600">
            {props.title}
          </h3>

          <div class="max-h-full overflow-hidden w-fit mx-auto relative sm:shadow-[-8px_8px_0_#fff] sm:border-4 border-white">
            <img
              class="z-10 mx-auto"
              src={props.image}
            />

            {props.children}
          </div>
          
        </div>
      </div>
    )
  }
  
  return (
    <section class="overflow-hidden bg-black min-h-screen h-full relative pt-10vh">
      <h2 class="text-white text-3xl font-mono text-center absolute top-20vh inset-x-0">
        # Les membres
      </h2>

      <Section title="Présidence" image="/PRESIDENCE.png">
        <PresentationCardWhois name="Florian CLAUX" role="Vice Président" left={12} />
        <PresentationCardWhois name="Maxence VINCENT" role="Président" right={12} />
      </Section> 
      <Section title="Trésorerie" image="/TRESORERIE.png">
        <PresentationCardWhois name="Noah TILLEUIL" role="Vice Trésorier" left={12} />
        <PresentationCardWhois name="Evan GERBEAUD" role="Trésorier" right={12} />
      </Section> 
      <Section title="Communication" image="/COMMUNICATION.png">
        <PresentationCardWhois name="Cathy DESCOUTURES" role="Responsable événement et communication" center />
      </Section> 

      <div class="bg-black h-80vh"/>
    </section>
  );
};

export default PresentationCards;
