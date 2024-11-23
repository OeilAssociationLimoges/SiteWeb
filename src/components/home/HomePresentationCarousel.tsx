import createEmblaCarousel from "embla-carousel-solid";
import { For, onMount, type Component } from "solid-js";
import AutoScroll from "embla-carousel-auto-scroll";

/**
 * `images` est une liste des images à afficher dans le carousel.
 * Il faut uniquement écrire le nom du fichier, le chemin est déjà défini sur `/LIFE/`.
 */
const HomePresentationCarousel: Component<{
  images: Array<{
    source: string
    description: string
  }>
}> = (props) => {
  const [emblaRef] = createEmblaCarousel(
    () => ({
      loop: true,
      dragFree: true
    }),
    () => [
      AutoScroll({
        stopOnInteraction: false,
        startDelay: 0,
        speed: 1.5,
      })
    ]
  );
  
  return (
    <div class="overflow-hidden py-8 cursor-grab" ref={emblaRef}>
      <div class="flex">
        <For each={props.images}>
          {(image) => (
            <div class="pl-4 flex-shrink-0">
              <img class="object-cover h-200px md:h-300px lg:h-400px hover:transform hover:-rotate-1 transition-all border-4 border-white hover:border-black mx-auto hover:shadow-[-8px_8px_0_#000]"
                src={`/LIFE/${image.source}`}
                alt={image.description}
              />
            </div>
          )}
        </For>
      </div>
    </div>
  );

};

export default HomePresentationCarousel;
