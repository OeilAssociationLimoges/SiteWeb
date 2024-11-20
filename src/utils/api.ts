import jwt from "jsonwebtoken";
import type { User } from "./client";

import _adherants from "../data/adherants.yml";
const adherants = _adherants as unknown as string[];

export const json = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    headers: { 'content-type': 'application/json' },
    status
  });
}

export const extractBearer = (request: Request) => {
  const authorization = request.headers.get('authorization');
  if (!authorization) {
    return null;
  }

  const parts = authorization.split(' ');
  if (parts.length !== 2) {
    return null;
  }

  const scheme = parts[0];
  const token = parts[1];

  if (/^Bearer$/i.test(scheme)) {
    return token;
  }

  return null;
};

export const shouldApplyDiscount = (user: User): boolean => {
  const username = `${user.lastName} ${user.firstName}`.toLowerCase();
  return adherants.includes(username);
}

export const readBearer = (request: Request): User | null => {
  const token = extractBearer(request);
  if (!token) return null

  try {
    return jwt.verify(token, import.meta.env.JWT_SECRET) as User;
  }
  catch {
    return null;
  }
};

const base = __PAYPAL_BASE__;

export const generateAccessToken = async () => {
  const BASE64_ENCODED_CLIENT_ID_AND_SECRET = Buffer.from(
    `${import.meta.env.PUBLIC_PAYPAL_CLIENT_ID}:${import.meta.env.PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const request = await fetch(
    base + "/v1/oauth2/token",
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${BASE64_ENCODED_CLIENT_ID_AND_SECRET}`,
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        response_type: "id_token",
        intent: "sdk_init",
      }),
    }
  );

  const json = await request.json();
  return json.access_token;
};

async function handleResponse<T extends any>(response: Response) {
  try {
    const jsonResponse = await response.json() as T;
    
    return {
      jsonResponse,
      httpStatusCode: response.status,
    };
  }
  catch (err) {
    const errorMessage = await response.text();
    throw new Error(errorMessage);
  }
}

/**
 * Create an order to start the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_create
 */
export const createOrder = async (product: ProductItem, variant: ProductVariant, applyDiscount: boolean) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders`;

  const price = applyDiscount ? product.adherant_price : product.price;

  const payload = {
    intent: "CAPTURE",
    payment_source: {
      paypal: {
        experience_context: {
          brand_name: "OEIL",
          shipping_preference: "NO_SHIPPING",
        }
      }
    },
    purchase_units: [
      {
        description: "Le SHOP de l'OEIL",
        items: [{
          name: `${product.name}: ${variant.name}`,
          quantity: "1",
          description: product.description,
          sku: `${product.id}#${variant.id}`,
          url: `https://iut-info-oeil.vercel.app/product/${product.id}`,
          category: "DIGITAL_GOODS",
          unit_amount: {
            currency_code: "EUR",
            value: price.toString()
          }
        }],
        amount: {
          currency_code: "EUR",
          value: price.toString(),
          breakdown: {
            item_total: {
              currency_code: "EUR",
              value: price.toString()
            }
          }
        },
      },
    ],
  };

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation: https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "MISSING_REQUIRED_PARAMETER"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "PERMISSION_DENIED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 * @see https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 */
export const captureOrder = async (orderID: string) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}/capture`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      // Uncomment one of these to force an error for negative testing (in sandbox mode only).
      // Documentation:
      // https://developer.paypal.com/tools/sandbox/negative-testing/request-headers/
      // "PayPal-Mock-Response": '{"mock_application_codes": "INSTRUMENT_DECLINED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "TRANSACTION_REFUSED"}'
      // "PayPal-Mock-Response": '{"mock_application_codes": "INTERNAL_SERVER_ERROR"}'
    },
  });

  return handleResponse(response);
};

export const readOrder = async (orderID: string) => {
  const accessToken = await generateAccessToken();
  const url = `${base}/v2/checkout/orders/${orderID}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return handleResponse<{
    id: string
    intent: string
    status: string
    purchase_units: [{
      amount: {
        currency_code: string
        value: string
      }

      items: [{
        name: string
        unit_amount: {
          currency_code: string
          value: string
        }
        quantity: string
        description: string
        sku: string
        url: string
      }]
    }]
  }>(response);
};
