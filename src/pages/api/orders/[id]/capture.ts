import type { APIRoute } from 'astro';
import { captureOrder, json, readBearer, readOrder, shouldApplyDiscount } from '../../../../utils/api';
import products from "../../../../data/products.yml";
import { insertProductEntry } from '../../../../utils/sheets';

export const POST: APIRoute = async ({ params, request }) => {
  const orderID = params.id as string;
  const user = readBearer(request);

  if (!user) {
    return json({ error: "Vous devez être connecté pour effectuer cette action." }, 401);
  }

  const body = await request.json() as {
    inputs: Record<string, string>
  }

  try {
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    
    if (httpStatusCode === 201) {
      const { jsonResponse, httpStatusCode } = await readOrder(orderID);

      if (httpStatusCode === 200) {
        // On peut lire les informations de la commande et récupérer
        // - le produit
        // - la variante
        // - le prix payé (juste pour la base de données)
        const unit = jsonResponse.purchase_units[0].items[0];
        const [productID, variantID] = unit.sku.split("#");

        const product = (<ProductItem[]>products).find(product => product.id === productID);
        if (!product) {
          return json({ error: "Le produit séléctionné est introuvable." }, 404);
        }

        const variant = product.variants.find(variant => variant.id === variantID);
        if (!variant) {
          return json({ error: "La variante séléctionnée est introuvable." }, 404);
        }

        const sheet = product.id;
        const inputs: Record<string, string> = {};

        for (const { id: key, type, name } of product.inputs ?? []) {
          if (type === "select") {
            const value = body.inputs[key];
            const optionName = (product.inputs!.find(input => input.id === key)! as ProductInputSelect).options.find(option => option.value === value)!.name!;
            // On va venir utiliser le nom de l'option à la place de l'ID.
            inputs[name] = optionName;
          }
          // Tout ce qui est textuel, on le garde tel quel.
          else {
            inputs[name] = body.inputs[key];
          }
        }
        
        await insertProductEntry(sheet, {
          acheteur: `${user.firstName} ${user.lastName.toUpperCase()}`,
          variant: variant.name,
          price: jsonResponse.purchase_units[0].items[0].unit_amount.value,
          payment_method: "SITE_INTERNET",
          adherent: shouldApplyDiscount(user), // if discount is applied, then it's an adherent
          paid: true,
          inputs
        });
      }
    }

    return json(jsonResponse, httpStatusCode);
  }
  catch (error) {
    console.error("[POST /api/:id/capture]:", error);
    return json({ error: "Failed to create order." }, 500);
  }
};
