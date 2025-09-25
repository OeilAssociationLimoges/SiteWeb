import type { APIRoute } from "astro";
import { json } from "../../utils/api";
import jwt from "jsonwebtoken";

import { cas, biome } from "unilim";

export const POST: APIRoute = async ({ request }) => {
  try {
    const { username, password } = (await request.json()) as {
      username: string;
      password: string;
    };

    const cas_token = await cas.login(username, password);
    const code = await cas.authorize(cas_token, cas.EXTERNAL_CLIENTS.BIOME);
    const { access_token } = await cas.tokenize(
      code,
      cas.EXTERNAL_CLIENTS.BIOME
    );
    const token = await biome.tokenize(access_token);
    const profile = await biome.profile(token, username);

    const firstName = profile.firstname;
    const lastName = profile.lastname.toUpperCase();
    const description = profile.title;
    const isStudentBUT = description.match(/Etudiant, BUT \d - INFO/) !== null;

    return json({
      token: jwt.sign(
        { firstName, lastName, isStudentBUT },
        import.meta.env.JWT_SECRET
      ),
      profilePicture: profile.avatar,
    });
  } catch {
    // Une erreur est survenue lors de la connexion, cas possibles :
    // - mauvais identifiants
    // - requête mal formatée
    // - changement dans l'API du CAS et/ou de Biome
    return json(null, 400);
  }
};
