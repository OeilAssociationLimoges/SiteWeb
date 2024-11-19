import type { APIRoute } from 'astro';
import { json } from '../../utils/api';
import jwt from "jsonwebtoken";

import {
  cas_login,
  login_check,
  cas_oauth2_authorize,
  cas_oauth2_token,
  get_user_profile
} from "pawnilim";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = await request.json() as {
      username: string;
      password: string;
    }
  
    const cas_token = await cas_login(username, password);
    const code = await cas_oauth2_authorize(cas_token);
    const { access_token } = await cas_oauth2_token(code);
    const { token } = await login_check(access_token);
    const profile = await get_user_profile(token, username);
  
    const firstName = profile.find(entry => entry.name === 'firstname').value;
    const lastName = profile.find(entry => entry.name === 'lastname').value.toUpperCase();
  
    return json({
      token: jwt.sign({ firstName, lastName }, import.meta.env.JWT_SECRET),
      profilePicture: profile.find(entry => entry.name === 'avatar').value
    });
  }
  catch {
    // Une erreur est survenue lors de la connexion, cas possibles :
    // - mauvais identifiants
    // - requête mal formatée
    // - changement dans l'API du CAS et/ou de Biome
    return json(null, 400);
  }
}
