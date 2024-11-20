import { createEffect, createSignal, For, Match, on, Show, Switch, type Component } from "solid-js";
import createEmblaCarousel from 'embla-carousel-solid';
import { loadScript } from "@paypal/paypal-js";
import { createStore, unwrap } from "solid-js/store";
import store from "../../../utils/store";
import MdiChevronLeft from '~icons/mdi/chevron-left'
import MdiChevronDown from '~icons/mdi/chevron-down'

const ShopDetailsArticle: Component<{ product: ProductItem }> = (props) => {
  const [paypalButtonsContainer, setPaypalButtonsContainer] = createSignal<HTMLDivElement>();
  const [emblaRef] = createEmblaCarousel(() => ({ loop: true }));
  const price = () => store.discount ? props.product.adherant_price : props.product.price;
  
  const [inputs, setInputs] = createStore<Record<string, string>>(
    props.product.inputs?.reduce((acc, input) => {
      switch (input.type) {
        case "select":
          acc[input.id] = input.options[0].value;
          break;
        case "text":
          acc[input.id] = "";
          break;
      }

      return acc;
    }, {} as Record<string, string>) || {}
  );

  const [variantID, setVariantID] = createSignal(props.product.variants[0].id);
  const variant = () => props.product.variants.find((variant) => variant.id === variantID())!;

  createEffect(on(paypalButtonsContainer,  async (paypalButtonsContainerRef) => {
    if (!paypalButtonsContainerRef) return;

    const paypal = await loadScript({
      clientId: import.meta.env.PUBLIC_PAYPAL_CLIENT_ID,
      components: ["buttons", "applepay"],
      currency: "EUR",
      locale: "fr_FR"
    });
    
    if (!paypal || !paypal.Buttons) {
      throw new Error("Le SDK de PayPal n'a pas pu être chargé, êtes vous en ligne ?");
    }
    
    paypal.Buttons({
      style: {
        shape: "rect",
        layout: "vertical",
        color: "gold",
        label: "paypal"
      },

      message: {
        // Prix pour le message affiché à la
        // fin de la transaction. 
        amount: price()
      },

      // Création de la commande pour effectuer au paiement.
      async createOrder () {
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              id: props.product.id,
              variant_id: variantID(),
              inputs: unwrap(inputs)
            })
          });

          const orderData = await response.json();

          // La commande a été créée, on passe à la prochaine étape.
          if (orderData.id) {
            return orderData.id;
          }

          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : orderData.error || JSON.stringify(orderData);

          throw new Error(errorMessage);
        }
        catch (error) {
          console.error(error);
          setTimeout(() => {
            alert(`La commande n'a pas pu être initiée, voir l'erreur suivante : "${error}"`);
          }, 250)
        }
      },

      async onApprove (data, actions) {
        try {
          const response = await fetch(`/api/orders/${data.orderID}/capture`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({
              inputs: unwrap(inputs)
            })
          });

          const orderData = await response.json();
          // Three cases to handle:
          //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
          //   (2) Other non-recoverable errors -> Show a failure message
          //   (3) Successful transaction -> Show confirmation or thank you message

          const errorDetail = orderData?.details?.[0];

          if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
            // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
            // recoverable state, per
            // https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
            return actions.restart();
          }
          else if (errorDetail) {
            // (2) Other non-recoverable errors -> Show a failure message
            throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
          }
          else if (!orderData.purchase_units) {
            throw new Error(orderData.error || JSON.stringify(orderData));
          }
          else {
            // (3) Successful transaction -> Redirection to the thanks you page
            window.location.assign(`/merci?order=${data.orderID}`);
          }
        }
        catch (error) {
          console.error(error);
          setTimeout(() => {
            alert(`La transaction n'a pas pu être effectuée, voir l'erreur suivante : "${error}"`);
          }, 250);
        }
      },
    }).render(paypalButtonsContainerRef);
  }));

  return (
    <article class="p-8 container mx-auto flex flex-col min-h-[calc(100dvh-6rem)]">
      <div class="lg:w-[calc(400px+1.5rem+532px)] lg:mx-auto">
        <a href="/shop" class="mb-8 flex items-center gap-2 w-fit hover:bg-black/5 focus:bg-black/8 px-4 py-2 -ml-4">
          <MdiChevronLeft />
          <p>Revenir à la page des produits</p>
        </a>
      </div>

      <div class="flex flex-col lg:flex-row grow-1 w-full gap-6 justify-center">
        <div class="relative h-full lg:sticky lg:top-32">
          <div class="shrink-0 flex flex-col gap-4 border-black border-2 lg:w-fit h-fit">
            <div class="overflow-hidden cursor-grab w-full lg:w-400px" ref={emblaRef}>
              <div class="flex">
                <For each={variant()!.images}>
                  {(image) => (
                    <div class="flex-[0_0_100%] min-w-0">
                      <img
                        src={`/_products/${image}`}
                        alt={props.product.name}
                        class="w-full h-300px lg:w-400px lg:h-400px object-contain bg-white select-none"
                      />
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="relative flex">
              <select class="cursor-pointer w-full font-mono bg-black text-white px-4 py-3.5 outline-none border-black border-t-2 hover:bg-black/80 transition-colors appearance-none"
                onChange={(event) => {
                  const value = event.currentTarget.value;
                  setVariantID(value);
                }}
              >
                <For each={props.product.variants}>
                  {(variant) => (
                    <option value={variant.id}
                      selected={variant.id === variantID()}
                    >
                      {variant.name}
                    </option>
                  )}
                </For>
              </select>

              <MdiChevronDown
                class="text-white text-xl absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />
            </div>

          </div>
        </div>

        <div class="flex flex-col font-mono w-full lg:max-w-532px">
          <h1 class="text-xl text-center mt-6 lg:text-start lg:mt-0">{props.product.name}</h1>
          <p class="text-2xl font-600 text-center lg:text-start">{price()} €</p>

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
                          class="w-full px-4 py-2 border-black border-2 bg-white text-black outline-none hover:bg-black/2 focus:bg-black/5 transition-colors"
                          onInput={(event) => {
                            setInputs(input().id, event.currentTarget.value);
                          }}
                        />
                      )}
                    </Match>
                    <Match when={input.type === "select" && input}>
                      {input => (
                        <div class="relative flex">
                          <select
                            class="cursor-pointer w-full px-4 py-2 border-black border-2 bg-white text-black outline-none hover:bg-black/2 focus:bg-black/5 transition-colors appearance-none"
                            onChange={(event) => {
                              setInputs(input().id, event.currentTarget.value);
                            }}
                          >
                            <For each={input().options}>
                              {(option) => (
                                <option value={option.value}>
                                  {option.name}
                                </option>
                              )}
                            </For>
                          </select>

                          <MdiChevronDown
                            class="text-black text-xl absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none"
                          />
                        </div>
                      )}
                    </Match>
                  </Switch>
                </label>
              )}
            </For>

            <Show when={store.user} fallback={
              <div class="flex flex-col gap-2 mt-8">
                <p class="font-sans text-center text-black/75 text-xs lg:text-base">
                  Vous devez vous identifier pour effectuer un paiement.
                </p>
                <a
                  href={`/identification?redirect=${encodeURIComponent(location.pathname)}`}
                  class="font-mono bg-black hover:bg-black/80 transition-colors text-white text-center py-3"
                >
                  S'identifier avec Biome
                </a>
              </div>
            }>
              <div ref={setPaypalButtonsContainer} class="w-full max-w-500px mx-auto mt-8 z-0" />
            </Show>
          </div>
        </div>
      </div>
    </article>
  )
}

export default ShopDetailsArticle;
