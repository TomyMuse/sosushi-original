# Sosushi

Tienda online de sushi con una version publica optimizada para despliegue estatico en Hostinger Business.

## Modos de despliegue

### Hostinger Business estatico

Genera una carpeta `dist/` lista para subir a `public_html/`:

```bash
npm install
npm run build:hostinger
```

Este comando:

- exporta la tienda publica como sitio estatico
- genera archivos HTML reales con `trailingSlash`
- deja el resultado final en `dist/`
- excluye temporalmente `api/`, `admin/` y `middleware` para evitar dependencias de Node en el build publico

Sube solo el contenido de `dist/` al hosting.

### Node.js

Si en algun momento quieres correr la app completa con backend:

```bash
npm install
npm run build
npm start
```

Notas:

- la app escucha el puerto manejado por Next standalone
- `start` usa `node`, no `bun`
- para produccion real conviene mover la base desde SQLite a MySQL u otra base persistente

## Desarrollo

```bash
npm install
npm run dev
```

## Lo que cambio para Hostinger

- el catalogo y descuentos de la tienda publica ahora salen de datos estaticos
- el checkout arma el pedido por WhatsApp en lugar de depender de `/api/orders`
- se removio la dependencia `z-ai-web-dev-sdk`
- se endurecio la configuracion de build: TypeScript ya no ignora errores y React Strict Mode quedo activo

## Estructura relevante

- `src/data/storefront.ts`: catalogo, descuentos y datos de contacto
- `src/lib/storefront.ts`: helpers de descuentos, precios y mensaje de pedido
- `scripts/build-hostinger.mjs`: genera `dist/` para Hostinger Business
