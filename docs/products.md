# [`/src/data/products.yml`](/src/data/products.yml)

C'est là où est défini les produits que vous voulez vendre sur votre site.

## Création d'un produit

```yml
- id: id-unique-du-produit
  name: Nom du produit tel qu'il apparaîtra sur le site
  description: Une petite description pour décrire le produit !
  price: 10.99 # le prix est unique par produit !
```

C'est maintenant qu'interviennent deux propriétés supplémentaires pour définir un produit.

## `variants`

Cette propriété est obligatoire pour définir les produits que l'on veut vendre.
Même s'il n'y a qu'un seul variant, il faut le définir dans ce tableau.

```yml
  variants:
    - id: id-unique-du-variant
      name: Nom du variant
      images:
        - image-du-variant.png
        - image-du-variant-2.png
        - image-du-variant-3.png
```

Vous pouvez mettre autant d'images que vous souhaitez, mais seulement la première image sera affichée sur la page du shop, pour voir les autres il faudra aller sur la page de détails du produit.

## `inputs`

Cette propriété est **optionnelle**, elle permet de définir des valeurs personnalisables pour le produit. Il faut y définir un `id` unique pour reconnaître l'option et un `name` pour la décrire.

Il existe différent types d'`input`, les voici :

### `type: text`

```yml
  inputs:
    - id: id-unique-de-l-input
      name: Nom de l'input texte
      type: text
      # Un texte écrit en placeholder pour guider l'utilisateur
      placeholder: "Entrez votre texte ici"
```

### `type: select`

```yml
  inputs:
    - id: id-unique-de-l-input
      name: Nom de l'input selection
      type: select
      # Les options possibles pour l'utilisateur
      options:
        - value: option-1
          label: Option 1
        - value: option-2
          label: Option 2
```
