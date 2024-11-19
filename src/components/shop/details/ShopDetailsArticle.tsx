import { createSignal, For, Match, Switch, type Component } from "solid-js";
import createEmblaCarousel from 'embla-carousel-solid';

const ShopDetailsArticle: Component<{ product: ProductItem }> = (props) => {
  let variantSelectedRef = document.getElementById("user-variant-selected") as HTMLInputElement;
  const [selectedVariantIndex, setSelectedVariantIndex] = createSignal(variantSelectedRef.value);
  const selectedVariant = () => props.product.variants.find((variant) => variant.id === selectedVariantIndex());

  const [emblaRef] = createEmblaCarousel(
    () => ({ loop: true })
  );

  return (
    <div class="flex w-full justify-between gap-6">
      <div class="shrink-0 flex flex-col gap-2 border-black border-2 w-fit">
        <div class="overflow-hidden cursor-grab w-400px" ref={emblaRef}>
          <div class="flex">
            <For each={selectedVariant()!.images}>
              {(image) => (
                <div class="flex-[0_0_100%] min-w-0">
                  <img
                    src={`/_products/${image}`}
                    alt={props.product.name}
                    class="w-400px h-400px object-contain bg-white select-none"
                  />
                </div>
              )}
            </For>
          </div>
        </div>

        <hr class="border-black border-t-2" />

        <div class="flex flex-wrap w-400px gap-2 p-4">
          <For each={props.product.variants}>
            {(variant) => (
              <div class="flex items-center gap-2 w-fit py-1.5 px-3 cursor-pointer select-none"
                classList={{
                  "bg-black text-white": selectedVariantIndex() === variant.id
                }}
                onClick={() => {
                  setSelectedVariantIndex(variant.id);
                  variantSelectedRef.value = variant.id;
                }}
              >
                <label for={variant.id}>{variant.name}</label>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="flex flex-col font-mono w-full">
        <h1 class="text-xl">{props.product.name}</h1>
        <p class="text-2xl font-600">{props.product.price} €</p>

        <div class="flex flex-col gap-4 mt-8">
          <For each={props.product.inputs}>
            {(input) => (
              <label class="flex flex-col">
                <span class="mb-2">
                  {input.name}
                </span>

                <Switch>
                  <Match when={input.type === "text" && input}>
                    {input => (
                      <input
                        type="text"
                        placeholder={input().placeholder}
                        class="w-full p-2 border-black border-2 bg-white text-black outline-none hover:bg-black/2 focus:bg-black/5 transition-colors"
                      />
                    )}
                  </Match>
                  <Match when={input.type === "select" && input}>
                    {input => (
                          <select id={input().id} class="w-full p-2 border-black border-2 bg-white text-black outline-none hover:bg-black/2 focus:bg-black/5 transition-colors">
                      <For each={input().options}>
                          {(option) => (
                            <option value={option.value}>
                              {option.name}
                            </option>
                          )}
                        </For>
                      </select>
                    )}
                  </Match>
                </Switch>
              </label>
            )}
          </For>
        </div>
      </div>
    </div>
  )
}

export default ShopDetailsArticle;
