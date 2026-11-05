# Cap

Agenda, alternance, révisions (flashcards, Score IAE, TAGE MAGE), actu du matin, nutrition et carnet muscu, en web app installable sur iPhone.

Adresse : https://guezellothomas-cyber.github.io/cap/

- `index.html` : l'appli (tout en un fichier)
- `data/` : données lourdes chargées à la demande (aliments Ciqual, carte du monde, modèle 3D)
- `muscu/` : le carnet FitPark Coach, construit avec `BASE_PATH=/cap/muscu/ VITE_DANS_CAP=1`
- `news/` : le point d'actu du jour (un fichier JSON par jour + `index.json`), mis à jour chaque matin

Les données restent sur le téléphone. Le carnet muscu partage le même site : Cap lit ses séances terminées et ses pesées.
