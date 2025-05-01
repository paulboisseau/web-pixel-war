# ue22-pixel-war

Sujet de TP aux Mines de Paris, UE22.

Remplir les TODO dans le js, puis dans le css.

## l'API

L'API est accessible à l'adresse `https://pixels-war.oie-lab.net/api/v1/`

On peut travailler sur plusieurs cartes, identifiées par un `map_id`; 
pour la carte principale le `map_id` vaut `0000`; 
il y a également une carte par groupe, avec un `map_id` de la forme `GRP1`, `GRP2`, etc. 
enfin il y a également une carte de test, avec un `map_id` qui vaut `TEST`.
Le timeout est différent pour chaque carte, commencez avec `TEST` pour tester votre code, le timeout est de 1 seconde.

Dans ce qui suit, remplacez `TEST` par le `map_id` de votre choix.

Voici ce que l'API permet de faire:

* `https://pixels-war.oie-lab.net/api/v1/TEST/preinit`  
  pour obtenir une clef pour apeller l'init  
  * Contenu de la reponse:  
    `{"key": "some_key"}`
* `https://pixels-war.oie-lab.net/api/v1/TEST/init?key={some_key}`  
  pour obtenir - entre autres - toute la map; vous recevrez aussi un `user_id`, que vous allez repasser ensuite à la même fonction.  
  * Contenu de la reponse:  
    `{"id": "user_id", "nx":100, "ny":100, "data":[[...]]}`
* `https://pixels-war.oie-lab.net/api/v1/TEST/deltas?id={user_id}`  
  et qui cette fois va vous répondre, non pas toute la map, mais la liste des pixels qui ont changé depuis la dernière fois que cet identifiant-là a émis cet appel.  
  * Contenu de la reponse:  
    `{"id": "user_id", "nx": 100, "ny": 100, "deltas": [[...]]}`
* `https://pixels-war.oie-lab.net/api/v1/TEST/set/{user_id}/y/x/r/g/b`  
  pour changer la couleur du pixel en *(x, y)* avec la couleur *(r, g, b)*  
  cet appel échoue si le même id a déjà changé un pixel il y a moins de 10 secondes.  
  * Contenu de la response:  
    (json aussi) 0 si l'opération a réussi, sinon le nombre de nano-secondes à attendre avant de pouvoir peindre un pixel