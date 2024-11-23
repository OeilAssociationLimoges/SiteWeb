# Site Web de l'OEIL

## Développement

Vous devez avoir Node.js (>=20 de préférence) et pnpm (`npm i -g pnpm`) d'installé sur votre machine.

Pour faire fonctionner le site dans son intégralité, vous devrez définir les variables d'envrionnements dans le fichier `.env`. Pour cela, copiez le fichier `.env.example` et renommez le `.env`.

```bash
cp .env.example .env
```

Ensuite, vous devrez remplir les variables d'environnement avec les valeurs adéquates.

Une fois terminé, vous pouvez lancer le site en mode développement avec les commandes suivantes :

```bash
pnpm install # installation des dépendances avec pnpm
pnpm dev # démarrage du serveur de développement
```

Naviguez sur <http://localhost:4321> pour voir le site en action.


## Licence

Le contenu de ce dépôt est sous licence MIT, voir le fichier [LICENSE](LICENSE) pour plus d'informations.
