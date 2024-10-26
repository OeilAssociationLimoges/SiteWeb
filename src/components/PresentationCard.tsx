import type { ParentComponent } from "solid-js";

import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

const PresentationCard: ParentComponent<{ title: string, image: string }> = (props) => {
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
        pin: true,
        pinSpacing: false,
        toggleActions: "play none none reverse",
      }
    });

    timeline
      .fromTo(element, 
        {
          rotate: 3,
          y: 220,
          opacity: 0,
          scale: 1.2,
        },
        {
          rotate: 0,
          y: 0,
          opacity: 1,
          scale: 1
        }
      )
      .to(element, {
        scale: 0.85
      })
      .to(element, {
        rotate: -6,
        y: -100,
        opacity: 0,
        scale: 0.65,
        ease: "power2.inOut"
      })

    gsap.set(progression, { scaleX: 0 })

    timeline
      .to(progression, {
        scaleX: 1,
        duration: 1
      }, 0)
      .to(progression, {
        borderWidth: 0,
        height: "125%",
        duration: 0.25,
      }, 1)

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
  }

  return (
    // @ts-ignore
    <div use:animation class="flex justify-center items-center top-0 h-screen pt-26 sm:pt-24 pb-8">
      <div class="flex flex-col gap-8 h-full relative w-full">
        <div class="relative w-fit mx-auto">
          <h3 class="text-white text-center tracking-wider text-2xl md:text-5xl uppercase font-600">
            {props.title}
          </h3>

          <div class="absolute -bottom-2 -inset-x-4 card-progression border-b-2 md:border-b-4 w-full bg-black h-0 mx-auto border-white z-50" />
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
  );
};

export default PresentationCard;
