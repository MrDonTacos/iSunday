# Speech Recognition Discord Bot

### English - Like 60% maybe
In order to use this bot you should have an google account to create a DialogFlow agent and a Youtube API V3
1. Create a DialogFlow Acoount
2. Create an DialogFlow Agent
3. Create an service account
4. Create JSON Credentials for the service account and save the file inside folders project
5. Set up action as 'play' inside intents
6. Inside entities define song
7. Create an Youtube API V3, here is an example of how to do it https://www.youtube.com/watch?v=TE66McLMMEw
8. Do the step inside 'Setting the environment variable' section https://cloud.google.com/docs/authentication/getting-started


### Español - Lengua principal
En orden para poder usar este bot se ocupan seguir los siguientes pasos

1. Crear cuenta en Dialogflow
2. Crear agente
3. Crear cuenta de servicio
4. Crear credenciales JSON y guardar en archivo dentro del proyecto
5. Configurar acción play del bot dentro de  los Intents
6. Configurar que es una canción y que es un artista dentro de los entieties
7. Crear proyecto para API V3 de youtube https://www.youtube.com/watch?v=TE66McLMMEw
8. Haz el paso que se encuentra dentro de 'Setting the environment variable' dentro de la siguiente liga https://cloud.google.com/docs/authentication/getting-started


Cambios respecto al proyecto base de apoyo
1. Se cambia librería ytsr debido a que el soporte para buscar la información de la canción fallaba debido a dificultades con youtube desde 2020
2. Se cambia a la librería de npm youtube-search
3. Se vuelve a reinstalar dependencias FFmp3
4. Se elimina duración ya que esta no se provee

Reconocimiento al código base de este proyecto
https://github.com/d4sein/Speech-Recognition-Bot
