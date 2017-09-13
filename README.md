# backend [![Build Status](https://travis-ci.org/LinkUpFiuba/backend.svg?branch=master)](https://travis-ci.org/LinkUpFiuba/backend)

## Servidor

### Configuración
Para correr el servidor, es necesario tener seteada la variable de ambiente `FIREBASE_PRIVATE_KEY` con la clave privada que se encuentra en el [archivo generado](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk?hl=es-419) por Firebase. Si no posee dicho archivo, contáctese para obtener dicha clave privada.

### Cómo correrlo?
Al utilizar `npm` es muy fácil correr el servidor. Para correrlo localmente, basta con correr:
```
npm start
```
Esto hará que con cada cambio que se haga, el servidor se restartee, lo cual es bastante útil. Si en cambio, se quiere correr el servidor para que quede "estático" (Como lo haría un servidor en producción), hay que correr el siguiente comando:
```
npm run build && npm run serve
```

## Testing
Para correr los tests, es necesario poder levantar un servidor Firebase localmente. Para ello se utiliza el paquete de `firebase-server`. Un requerimiento que tiene dicho paquete es que el host en donde se levanta Firebase debe tener 2 puntos (Es decir, no se puede levantar en `127.0.0.1`, ya que tiene 3 puntos). Por ello, es necesario crear un "alias" para esto, que se corresponda con dicha restricción. Para eso, basta con correr este comando:

```bash
sudo -- sh -c -e "echo '127.0.0.1   localhost.firebaseio.test' >> /etc/hosts"
```

Luego de esto, basta con correr los tests como:
```
npm test
```

## API
_**Nota:** todos los requests que se hacen deben contener un header con 'token' como clave y el valor del token del usuario como valor_

### - `/users`
Devuelve todos los usuarios posibles de linkeo con el usuario que hace el request.
