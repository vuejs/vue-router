# Comment faire ? #

- [Pour savoir ce qu'il reste à traduire c'est par ici](https://github.com/vuejs-fr/vue-router/issues/1)

Pour tous ceux qui souhaitent traduire les page de la doc officielle en français :

## Conseils ##

> Si vous avez **beaucoup de temps** à consacrer à cette tâche par jour, **traduisez les premières pages** du guide.
> Si vous avez **peu de temps** à consacrer à cette tâche par jour, **traduisez des pages plus éloignées** dans le guide, ou les pages des autres dossiers.


### Important ###

Il faut conserver le même nombre de lignes entre le fichier original et le fichier traduit et s'assurer que chaque numéro de ligne original corresponde à son numéro de ligne traduit. Cela nous permettra de suivre plus facilement les pans de texte qui ont changés dans le futur ou même d'avoir version EN/FR en concordance dans nos pulls request ligne par ligne — ce qui est plus pratique pour les reviews.

## Étapes ##

### 1. Informer

Dites ici que vous allez entreprendre la traduction d'une page. Éditez le premier post et changez l'état de la liste si vous en avez le droit.

### 2. Faire un fork

Faites un fork du dépôt `vuejs-fr/vue-router:working` (ce dépôt) vers `{your-username}/vuejs.org:working` (chez vous).

### 3. Créer une branche

Créez une nouvelle branche {branch} dédiée spécifiquement au changement de votre fichier.

#### 4. Débuter la traduction

Commencez à traduire votre fichier directement depuis `en` pour pouvoir effectuer au moins un premier commit.

#### 5. Demander de l'aide

Faites une pull request depuis votre branche de fork `{your-username}/vue-router:{branch}` vers notre branche de dépôt `vuejs-fr/vue-router:working` pour que tout le monde puisse garder un œil sur l'avancée de votre traduction et que vous puissiez éventuellement demander des conseils. Assignez (*assignees*) vous cette pull request.

#### 6. Réclamer des reviews

Quand votre traduction est assez mûr pour une review, affectez des personnes en tant que reviewer (probablement celles qui vous auront aidé lors de la traduction) pour qu'elles sachent qu'elles peuvent consacrer un temps plus conséquent à la relecture minutieuse de votre travail.

#### 7. Itérez les ajustements 

De la même manière qu'avant review votre traduction a été mis à jour au fur et à mesure de vos commits sur la pull request ; vous mettez à jour maintenant les remarques de review pour solidifier votre travail toujours avec des commits. Au moins 3 relecteurs sont recommandés.

#### 8. Merger

Une fois tout en ordre et que toutes les reviews sont approuvées vous pouvez merger votre travail. Il sera ensuite reverser sur la branche `vuejs-fr/vue-router:dev` dans le dossier `fr` et proposer en pull request au repository officiel `vuejs/vue-router:dev`.

## Voir le résultat sur le site https://router.vuejs.org/fr/

La monter en production n'est pas de notre ressort, soyez patient !