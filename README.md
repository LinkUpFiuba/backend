# backend [![Build Status](https://travis-ci.org/LinkUpFiuba/backend.svg?branch=master)](https://travis-ci.org/LinkUpFiuba/backend)

## Configuración
Para correr el servidor, es necesario tener seteada la variable de ambiente `FIREBASE_PRIVATE_KEY` con la clave privada que se encuentra en el [archivo generado](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk?hl=es-419) por Firebase. Si no posee dicho archivo, contáctese para obtener dicha clave privada.

## API
_**Nota:** todos los requests que se hacen deben contener un header con 'token' como clave y el valor del token del usuario como valor_

### - `/users`
Devuelve todos los usuarios posibles de linkeo con el usuario que hace el request.
