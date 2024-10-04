import type { APIRoute } from 'astro';
import jwt from "jsonwebtoken";
import { json, readBearer } from '../../utils/api';

export const GET: APIRoute = ({ request }) => {
  const token = readBearer(request);

  if (!token) {
    return json({ error: 'No token provided' }, 401);
  }

  try {
    const payload = jwt.verify(token, import.meta.env.JWT_SECRET);
    return json(payload);
  }
  catch {
    return json({ error: 'Invalid token' }, 401);
  }
}
