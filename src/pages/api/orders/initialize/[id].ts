import type { APIRoute } from 'astro';
import { json } from '../../../../utils/api';
import products from "../../../../data/products.yml";
import { getPaymentSheet } from '../../../../utils/sheets';

export const GET: APIRoute = async ({ params }) => {
  const productID = params.id as string;

  try {
    const product = (<ProductItem[]>products).find(product => product.id === productID);
    if (!product) {
      return json({ error: "Le produit mentionné est introuvable." }, 404);
    }
  
    const inputs = (product.inputs ?? []).map(input => input.name);
    // On crée une nouvelle feuille pour le produit si elle n'existe pas déjà.
    await getPaymentSheet(import.meta.env.SHEET_PAYMENTS_ID, productID, inputs);
  
    return json({ success: true });
  }
  catch (error) {
    return json({ error: "Une erreur est survenue lors de l'initialisation de la feuille de commande." }, 500);
  }
};

