# Configuration Passerelle - Cloud

Premièrement pour utiliser Ubidots, il faut se créer un compte à l'adresse suivante : https://industrial.ubidots.com/accounts/signup_industrial

Une fois connecté à votre compte, il vous faut récupérer votre Token qui vous permettra d'interagir avec Ubidots :
- cliquez sur l'onglet de votre profil en haut à droite => "API credentials"
- copiez et conservez votre Token qui apparait dans le menu déroulant

Ensuite :
- sélectionner le menu "Devices"
- ajoutez un objet IoT en cliquant sur le petit "+" => blank
- entrez le nom de votre futur objet IoT

Ensuite :
- cliquez sur votre nouvel objet =>  Add variable => Raw
- changez le nom de la nouvelle variable créée
- cliquez sur la variable => copiez et conservez son identifiant (champs "ID" dans le menu de gauche)

Cette variable servira de mini base de donnée à votre objet IoT étant donné que ce dernier enverra ses donnée à destination de cette dernière dans le Cloud (Ubidots).

La configuration du Cloud est maintenant terminée, il faut maintenant créer un script sur votre objet IoT afin de commencer à publier des choses à destination de la variable créée sur Ubidots.

Suivre la procédure suivante afin d'envoyer/recevoir des données au cloud : https://help.ubidots.com/connect-your-devices/connect-the-raspberry-pi-with-ubidots

Veuillez à remplacer les valeurs des variables suivantes :
- TOKEN => mettre le token de votre compte (préalablement copié) 
- DEVICE_LABEL => mettre le nom de votre object IoT créé précédemment 
- VARIABLE_LABEL_1 => mettre le nom de la variable créé précédemment
- VARIABLE_LABEL_2 / VARIABLE_LABEL_3 => à supprimer du code ou à laisser tel quel

Suite à cela, vous devriez être en mesure d'interagir avec le Cloud :
- rafraichir la page d'Ubidots
- sélectionnez son objet dans l'onglet "Device"
- sélectionnez la variable de l'objet
=> des données ont normalement été envoyées par votre objet et donc été reçues par la variable de l'objet dans Ubidots.

# Les widgets

Pour effectuez des traitements sur les données récupérées, il est possible d'utiliser des widgets préfaits :
- allez dans l'onglet Data => Dashboards
- ajoutez des widgets pour votre dashboard en cliquant sur le "+" en haut à droite
- sélectionnez un type de widget puis configurez le avec les données de votre objet (PLus d'informations via ce lien : https://help.ubidots.com/user-guides/create-dashboards-and-widgets)


Il est également possible de créer vos propre widgets via des canvas HTML.
Le code source de notre widget est disponible dans le répertoire. Ce dernier affiche les coordonées GPS récupérées par notre objet IoT sur une Google Map.

Afin de récupérer toutes les valeurs d'une variable d'un objet, il faut utiliser l'url suivante avec un Token valide (voir requête ajax dans le code): https://industrial.api.ubidots.com/api/v1.6/variables/' + ID_VARIABLE + '/values

Il est ensuite possible de parser toutes les données en json et ensuite de les traiter et les afficher par votre widget.
