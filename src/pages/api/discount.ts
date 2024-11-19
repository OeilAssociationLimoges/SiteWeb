import type { APIRoute } from 'astro';
import { json, readBearer, shouldApplyDiscount } from '../../utils/api';

export const GET: APIRoute = ({ request }) => {
  const user = readBearer(request);

  if (!user) {
    return json({ discount: false });
  }

  return json({ discount: shouldApplyDiscount(user) });
}
