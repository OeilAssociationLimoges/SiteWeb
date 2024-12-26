import type { APIRoute } from 'astro';
import { createOrder, readBearer, json, shouldApplyDiscount } from '../../../utils/api';
import products from "../../../data/products.yml";

/**
 * `POST /api/orders`, permet la création d'une commande
 * en utilisant l'API de PayPal.
 */
export const POST: APIRoute = async ({ request }) => {
  const user = readBearer(request);
  
  if (!user) {
    return json({ error: "Vous devez être connecté pour créer une commande." }, 401);
  }

  const body = await request.json() as {
    id: string;
    variant_id: string;
    inputs: Record<string, string>;
  };

  const product = (<ProductItem[]>products).find(product => product.id === body.id);
  if (!product) {
    return json({ error: "Le produit séléctionné est introuvable." }, 404);
  }

  if (product.disabled === true || product.can_buy === false) {
    return json({ error: "Le produit séléctionné n'est pas disponible à l'achat." }, 400);
  }

  const variant = product.variants.find(variant => variant.id === body.variant_id);
  if (!variant) {
    return json({ error: "La variante séléctionnée est introuvable." }, 404);
  }

  for (const input of product.inputs ?? []) {
    let isRequired = true;

    if (input.type === "text") {
      isRequired = input.required ?? false;
    }
    
    if (isRequired && !body.inputs[input.id]) {
      return json({ error: `Le champ ${input.name} est requis.` }, 400);
    }
  }

  try {
    const { jsonResponse, httpStatusCode } = await createOrder(product, variant, await shouldApplyDiscount(user));
    return json(jsonResponse, httpStatusCode);
  }
  catch (error) {
    console.error("[POST /api/orders]:", error);
    return json({ error: "Une erreur s'est produite lors de la création de la commande." }, 500);
  }
};
