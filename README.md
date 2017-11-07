# backend [![Build Status](https://travis-ci.org/LinkUpFiuba/backend.svg?branch=master)](https://travis-ci.org/LinkUpFiuba/backend)

## Servidor

### Configuración
Para correr el servidor, es necesario tener seteada la variable de ambiente `FIREBASE_PRIVATE_KEY` con la clave privada que se encuentra en el [archivo generado](https://console.firebase.google.com/project/_/settings/serviceaccounts/adminsdk?hl=es-419) por Firebase. Si no posee dicho archivo, contáctese para obtener dicha clave privada.

Por otro lado, al correr en 2 ambientes distintos sobre la misma base de datos, hay ciertas cosas (Como por ejemplo la detección de links, que es algo que está corriendo en todo momento) que no pueden estar corriendo en ambos lados. Por ello seteamos una variable de ambiente para que esto sólo se corra en producción. Dicha variable de ambiente se llama `ENVIRONMENT`, y tendrá un valor de `production` si es ambiente productivo o `development` si es de desarrollo.

### Cómo correrlo?
Al utilizar `npm` es muy fácil correr el servidor. Para correrlo localmente, basta con correr:
```
npm start
```

En caso de querer correr la aplicación localmente como si corriese en producción (Es decir, para correr la detección de links por ejemplo), es suficiente con correr de la siguiente manera:
```bash
ENVIRONMENT="production" npm start
```

Esto hará que con cada cambio que se haga, el servidor se restartee, lo cual es bastante útil. Si en cambio, se quiere correr el servidor para que quede "estático" (Como lo haría un servidor en producción), hay que correr el siguiente comando:
```
npm run build && npm run serve
```

### Dónde está hosteado?
Poseemos 2 ambientes de desarrollo: uno de producción y otro de desarrollo. Ambos ambientes están hosteados en Heroku. El ambiente de producción se deploya cada vez que hay un push en `master`, mientras que el de desarrollo hace lo suyo cuando se pushea a `develop`. Los links a los servidores correspondientes son:

- Producción: https://link-up-g1.herokuapp.com/
- Development: https://dev-link-up-g1.herokuapp.com/

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

### App

_**Nota:** todos los requests que se hacen deben contener un header con 'token' como clave y el valor del token del usuario como valor_

#### `GET` - `/users`
Devuelve todos los usuarios posibles de linkeo (Es decir, los candidatos) con el usuario que hace el request.

#### `GET` - `/users/<id>`
Devuelve al usuario `id`.

#### `DELETE` - `/users/<id>`
Elimina la cuenta del usuario `id`, eliminando sus chats, links, unlinks, denuncias, matches y la sesión en sí.

#### `POST` - `/users`
[Para testear] Crea un usuario de Firebase para poder hacer requests como si se hicieran desde la app.

#### `POST` - `/getToken`
[Para testear] Utilizado para obtener el token de Firebase de un usuario creado mediante el `POST` a `/users`, necesario para hacer los requests anteriores.

### Administrador

#### `GET` - `/ads`
Devuelve todos las publicidades que hay registradas.

#### `POST` - `/ads`
Crea un nuevo anuncio. Se le debe enviar un `title`, un link a una `image` y un `state`.

#### `DELETE` - `/ads/<id>`
Borra la publicidad `id`.

#### `POST` - `/ads/<id>/enable`
Habilita la publicidad `id`.

#### `POST` - `/ads/<id>/disable`
Deshabilita la publicidad `id`.

#### `GET` - `/complaints`
Devuelve todas las denuncias de todos los usuarios.

#### `GET` - `/complaints/<id>`
Devuelve las denuncias para el usuario `id`.

#### `GET` - `/analytics/complaints/type`
Devuelve la cantidad de denuncias de cada tipo. Se pueden especificar los _query parameters_ `startDate` y `endDate` para restringir las fechas. Estos parámetros deben seguir el formato `YYYY-MM`.

#### `GET` - `/analytics/complaints/disabled`
Devuelve la cantidad de denuncias de un tipo especificado mediante el _query parameter_ `type`. Éste debe ser un tipo válido; en caso contrario no devolverá nada. 

#### `POST` - `/users/<id>/disable`
Deshabilita al usuario `id` debido a las denuncias recibidas.

#### `POST` - `/users/<id>/enable`
Habilita a un usuario `id`.
