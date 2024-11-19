import type { APIRoute } from 'astro';
import { createOrder, isAuthenticated, json } from '../../../utils/api';
import products from "../../../data/products.yml";

/**
 * `POST /api/orders`, permet la création d'une commande
 * en utilisant l'API de PayPal.
 */
export const POST: APIRoute = async ({ request }) => {
  if (!isAuthenticated(request)) {
    return json({ error: "Vous devez être connecté pour créer une commande." }, 401);
  }

  const body = await request.json() as {
    id: string;
  };

  const product = (<ProductItem[]>products).find(product => product.id === body.id);
  if (!product) {
    return json({ error: "Le produit séléctionné est introuvable." }, 404);
  }

  try {
    const { jsonResponse, httpStatusCode } = await createOrder(product.price);
    return json(jsonResponse, httpStatusCode);
  }
  catch (error) {
    console.error("[POST /api/orders]:", error);
    return json({ error: "Une erreur s'est produite lors de la création de la commande." }, 500);
  }
};
