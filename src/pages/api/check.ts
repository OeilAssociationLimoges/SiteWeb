import type { APIRoute } from 'astro';
import { json, readBearer } from '../../utils/api';

export const GET: APIRoute = ({ request }) => {
  const user = readBearer(request)

  if (!user) {
    return json({ error: "Vous n'êtes pas connecté." }, 401);
  }

  return json(user);
}
