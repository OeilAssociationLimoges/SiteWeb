import { createEffect, createSignal, For, Match, on, Show, Switch, type Component } from "solid-js";
import createEmblaCarousel from 'embla-carousel-solid';
import { loadScript } from "@paypal/paypal-js";
import { createStore } from "solid-js/store";
import store from "../../../utils/store";

const ShopDetailsArticle: Component<{ product: ProductItem }> = (props) => {
  const [paypalButtonsContainer, setPaypalButtonsContainer] = createSignal<HTMLDivElement>();
  const [emblaRef] = createEmblaCarousel(() => ({ loop: true }));
  
  const [inputs, setInputs] = createStore<Record<string, string>>({});
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
        amount: props.product.price
      },

      // Création de la commande pour effectuer au paiement.
      async createOrder () {
        try {
          const response = await fetch("/api/orders", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: props.product.id,
              // variant: variantID(),
              // inputs: unwrap(inputs)
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
              : JSON.stringify(orderData);

          throw new Error(errorMessage);
        }
        catch (error) {
          console.error(error);
          alert(`PayPal Checkout n'a pas pu être initié : ${error}`);
        }
      },

      async onApprove (data, actions) {
          try {
              const response = await fetch(
                  `/api/orders/${data.orderID}/capture`,
                  {
                      method: "POST",
                      headers: {
                          "Content-Type": "application/json",
                      },
                  }
              );

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
                throw new Error(
                    `${errorDetail.description} (${orderData.debug_id})`
                );
              }
              else if (!orderData.purchase_units) {
                throw new Error(JSON.stringify(orderData));
              }
              else {
                  // (3) Successful transaction -> Show confirmation or thank you message
                  // Or go to another URL:  actions.redirect('thank_you.html');
                  const transaction =
                      orderData?.purchase_units?.[0]?.payments
                          ?.captures?.[0] ||
                      orderData?.purchase_units?.[0]?.payments
                          ?.authorizations?.[0];
        //           resultMessage(
        //               `Transaction ${transaction.status}: ${transaction.id}<br>
        // <br>See console for all available details`
        //           );
                  console.log(
                      "Capture result",
                      orderData,
                      JSON.stringify(orderData, null, 2)
                  );
              }
          }
          catch (error) {
            console.error(error);
            // resultMessage(
            //     `Sorry, your transaction could not be processed...<br><br>${error}`
            // );
          }
      },
    }).render(paypalButtonsContainerRef);
  }));

  return (
    <div class="flex flex-col lg:flex-row h-full w-full gap-6">
      <div class="relative h-full">
        <div class="shrink-0 flex flex-col gap-4 border-black border-2 lg:w-fit h-fit sticky top-28">
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

          <select class="bg-white px-2 py-3.5 outline-none border-black border-t-2 hover:bg-black/2 focus:bg-black/5 transition-colors"
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
        </div>
      </div>

      <div class="flex flex-col font-mono w-full">
        <h1 class="text-xl text-center mt-6 lg:text-start lg:mt-0">{props.product.name}</h1>
        <p class="text-2xl font-600 text-center lg:text-start">{props.product.price} €</p>

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

          <Show when={store.user} fallback={
            <div class="flex flex-col gap-2 mt-8">
              <p class="font-sans text-center text-black/75 text-xs lg:text-base">
                Vous devez vous identifier pour effectuer un paiement.
              </p>
              <a
                href="/identification"
                class="font-mono bg-black text-white text-center py-3"
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
  )
}

export default ShopDetailsArticle;
