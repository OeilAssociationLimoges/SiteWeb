import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

const getDocument = async (id: string) => {
  const jwt = new JWT({
    email: import.meta.env.SA_CLIENT_EMAIL,
    key: import.meta.env.SA_PRIVATE_KEY,
    scopes: SCOPES
  });

  const doc = new GoogleSpreadsheet(id, jwt);
  await doc.loadInfo();
 
  return doc;
};

export const getPaymentSheet = async (id: string, productId: string, inputs: string[]) => {
  const doc = await getDocument(id);
  let sheet = doc.sheetsByTitle[productId];

  if (typeof sheet === 'undefined') {
    sheet = await doc.addSheet({
      title: productId,
      headerValues: [
        "Acheteur",
        "Variant",
        ...inputs,
        "Prix",
        "Payé?",
        "Adhérent?",
        "Méthode de paiement",
        "Date"
      ]
    });
  }

  return sheet;
}

export const insertProductEntry = async (productId: string, details: {
  acheteur: string,
  variant: string,
  inputs: Record<string, string>,
  price: string,
  paid: boolean,
  adherent: boolean,
  payment_method: string
}) => {
  const doc = await getDocument(import.meta.env.SHEET_PAYMENTS_ID);
  let sheet = doc.sheetsByTitle[productId];
  if (typeof sheet === 'undefined') {
    sheet = await doc.addSheet({
      title: productId,
      headerValues: [
        "Acheteur",
        "Variant",
        ...Object.keys(details.inputs),
        "Prix",
        "Payé?",
        "Adhérent?",
        "Méthode de paiement",
        "Date"
      ]
    });
  }

  await sheet.addRow({
    "Acheteur": details.acheteur,
    "Variant": details.variant,
    ...details.inputs,
    "Prix": details.price,
    "Payé?": details.paid,
    "Adhérent?": details.adherent,
    "Méthode de paiement": details.payment_method,
    "Date": new Date().toLocaleString("fr-FR")
  });
};

export const readAdherants = async (): Promise<Array<string>> => {
  const doc = await getDocument(import.meta.env.SHEET_ADHERANTS_ID);
  const sheet = doc.sheetsByIndex[0];
  
  const rows = await sheet.getRows<Record<"Nom" | "Prénom", string>>();
  return rows.map(row => `${row.get("Nom")} ${row.get("Prénom")}`.toLowerCase());
};
