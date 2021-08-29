# Création d'un forum de discussion Front et Back

Cet exercice réalisé dans le cadre de mon parcours Open Class Room consistait à créer le prototype d'un espace de discussion textuel fonctionnel pour une entreprise.
J'ai choisi Angular pour le FrontEnd, ExpressJS pour le back, et j'ai employé une base de données mySQL.

Le site est entièrement modulaire, les diverses parties sont mise à jour de façon dynamique en fonction de ce que fait l'utilisateur, la page n'est jamais rechargé.
Un module permet de contrôler l'enregistrement des utilisateur. Si le mail ou le nom d'affichage choisit existe déjà dans la base de données, un texte s'affiche pour signaler le problème à l'usager. Autrement, le mot de passe est enregistré sous forme de Hash dans la base de données, et l'utilisateur est automatiquement connecté au site.
Pour la connexion, le front reçoit un token unique et temporaire. Un cookie est créer du côté front pour pouvoir maintenir la session pendant un temps donnée. Le cookie est une solution temporaire pour le prototype fonctionnel, jugé plus sûr qu'un stockage de session classique par l'OWASP en l'absence d'un protocole HTTPS.

Une fois connecté, il est possible pour un utilisateur de créer un nouveau fil de discussion, de voir les fils de discussions existants déjà sur la page principale, ou de répondre à une discussion déjà en cours. Les posts s'affichent du plus récent au plus ancien pour permettre de rapidement voir les nouveaux posts. Le nombre de posts à affiché est limité pour éviter une surcharge de la page si le nombre de fils de discussions augmente, un bouton permettra alors de charger les fils de discussions suivant.
Il est possible de cliquer sur un commentaire pour le voir de plus prêt et voir les éventuels commentaires du commentaires, dont le nombre est affiché sur le bouton dans le cas ou il en existe.

Un utilisateur peut supprimer ou éditer uniquement ses posts. Un utilisateur peut être mis au niveau d'administrateur directement dans la base de données, ce qui lui permet de pouvoir supprimer n'importe quel post, mais il ne peut toujours éditer que les siens pour limiter les possibilités d'abus.
Un utilisateur peut aussi complètement supprimer son compte. Ses posts ne seront pas supprimer, mais son nom sera remplacé par "Anonyme" dans tous les posts, et le reste de ses informations seront complètement supprimés dans la base de données.

Toutes les données mySQL sont préalablement préparées et vérifiées avant d'être rentrées dans la base de données. Des guards sont employés pour empêcher les utilisateurs non enregistrés d'accéder à autre chose qu'à la page d'authentification.
