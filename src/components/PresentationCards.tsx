import { children, createEffect, onCleanup, type Component, type ParentComponent } from "solid-js";
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
    const isMobile = createMediaQuery("(max-width: 639px)", true);

    const animation = (element: HTMLDivElement) => {
      gsap.registerPlugin(ScrollTrigger);
      const progression = element.querySelector(".card-progression") as HTMLDivElement;
      const whois = element.querySelectorAll(".card-whois") as NodeListOf<HTMLDivElement>;

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

      createEffect(() => {
        timeline
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

        gsap.set(progression, { scaleX: 0 })

        timeline
          .to(progression, {
            scaleX: 1,
            duration: 1.15,
            ease: "power2.in"
          }, 0)

        for (let index = 0; index < whois.length; index++) {
          const node = whois[index];

          gsap.set(node, {
            y: 50,
            opacity: 0
          })

          timeline
            .to(node, {
              y: 0,
              opacity: 1,
              duration: .6,
              ease: "power2.inOut"
            }, 0.11 * (index + 1))
        }
      })
    }

    return (
      // @ts-ignore
      <div use:animation class="flex justify-center items-center top-0 h-screen pt-26 sm:pt-24 pb-8">
        <div class="flex flex-col gap-8 h-full relative w-full">
          <div class="relative w-fit mx-auto">
            <h3 class="text-white text-center tracking-wider text-2xl md:text-5xl uppercase font-600">
              {props.title}
            </h3>

            <div class="absolute -bottom-2 inset-x-0 card-progression h-[4px] w-full mx-auto bg-white z-50" />
          </div>

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
