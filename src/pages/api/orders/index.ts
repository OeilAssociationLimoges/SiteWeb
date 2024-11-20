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

  const variant = product.variants.find(variant => variant.id === body.variant_id);
  if (!variant) {
    return json({ error: "La variante séléctionnée est introuvable." }, 404);
  }

  for (const { id: key, name } of product.inputs ?? []) {
    if (!body.inputs[key]) {
      return json({ error: `Le champ ${name} est requis.` }, 400);
    }
  }

  try {
    const { jsonResponse, httpStatusCode } = await createOrder(product, variant, shouldApplyDiscount(user));
    return json(jsonResponse, httpStatusCode);
  }
  catch (error) {
    console.error("[POST /api/orders]:", error);
    return json({ error: "Une erreur s'est produite lors de la création de la commande." }, 500);
  }
};
