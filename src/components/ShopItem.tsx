import { createEffect, createMemo, createSignal, For, onMount, type Component } from "solid-js";
import createEmblaCarousel from 'embla-carousel-solid';
import store from "../utils/store";

const ShopItem: Component<{ product: ProductItem }> = (props) => {
  const [emblaRef, emblaApi] = createEmblaCarousel(
    () => ({ loop: true })
  );

  const [index, setIndex] = createSignal(0);
  const images = createMemo(() => props.product.variants.map((variant) => variant.images[0]));

  createEffect(() => {
    const api = emblaApi();
    if (!api) return;

    setIndex(api.selectedScrollSnap());
    api.on('select', () => setIndex(api.selectedScrollSnap()));
  })
  
  return (
    <div class="relative shrink-0 flex flex-col w-full md:w-xl border-3 border-black shadow-[-8px_8px_0_#000]">
      <div class="absolute z-10 pointer-events-none top-2 right-2 flex flex-col gap-1 items-end">
        <span class="text-sm sm:text-base w-fit bg-black text-white px-3 py-.5">
          {props.product.variants[index()].name}
        </span>
        <span class="text-xs sm:text-sm w-fit bg-black text-white px-3 py-.5">
          {index() + 1} / {images().length}
        </span>
      </div>

      <div class="overflow-hidden cursor-grab" ref={emblaRef}>
        <div class="flex w-full h-300px">
          <For each={images()}>
            {(image) => (
              <div class="flex-[0_0_100%] min-w-0">
                <img
                  src={`/_products/${image}`}
                  alt={props.product.name}
                  class="w-full h-full object-contain bg-white select-none"
                />
              </div>
            )}
          </For>
        </div>
      </div>
      
      <div class="flex items-center justify-between gap-2 border-t-3 border-black p-4 bg-black text-white font-mono">
        <p>
          &gt; {props.product.name}
        </p>
        <p class="text-lg shrink-0">
          {(store.discount ? props.product.adherant_price : props.product.price).toFixed(2)} €
        </p>
      </div>
      <div class="p-4 space-y-6">
        <p class="">
          {props.product.description}
        </p>

        <a
          class="block text-center bg-black text-white w-full px-2 py-4 font-mono hover:bg-black/75 transition-colors"
          href={`/product/${props.product.id}`}  
        >
          voir le produit
        </a>
      </div>
    </div>
  );
};

export default ShopItem;
