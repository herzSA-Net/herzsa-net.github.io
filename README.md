# Sitio oficial HerzSA.Net

Sitio estático (HTML, CSS y JavaScript sin dependencias) para **HerzSA.Net**, **MultiNet** y **HerzSA TV**, listo para GitHub Pages.

## Estructura

```text
index.html              Inicio: resumen de todo el sitio (diseño de la muestra pgnw.png)
servicios/index.html    Servicios: Internet, IPTV, radiofrecuencia VHF, ecosistema
planes/index.html       Planes residenciales, fichas y puntos de venta
cobertura/index.html    Localidades HerzSA.Net y red MultiNet (buscador y filtros)
multinet/index.html     MultiNet: roaming entre redes WISP aliadas
herzsa-tv/index.html    HerzSA TV: app para Roku, inicio de sesión, FAQ
herzsa-tv/privacidad/   Política de privacidad de la app (texto del responsable)
herzsa-tv/terminos/     Términos y condiciones de la app (texto del responsable)
herzsa-tv/soporte/      Soporte técnico de la app
herzsa-tv/descargar/    Descargas e instrucciones de instalación (Android, Windows, Roku)
assets/descargas/       APK de Android y ZIP de Roku
soporte/index.html      Centro de ayuda (Internet, MultiNet, HerzSA TV)
privacidad/index.html   Aviso de privacidad (BORRADOR)
terminos/index.html     Términos de uso (BORRADOR)
404.html                Página de error
assets/css/styles.css   Estilos (modo claro/oscuro)
assets/js/config.js     ← DATOS EDITABLES (contacto, precios, cobertura, apps)
assets/js/main.js       Lógica de la interfaz
assets/images/          Logotipos oficiales (HerzSA.Net, MultiNet, HerzSA TV) en WebP
favicon.svg, robots.txt, sitemap.xml, .nojekyll
```

## Vista previa local

```bash
cd Pagina_Web_Nueva
python3 -m http.server 8840
# Desde otra PC de la red: python3 -m http.server 8841 --bind <IP-de-esta-PC>
# Abrir http://127.0.0.1:8840/
```

Use un servidor local; al abrir los archivos con doble clic (`file://`) el navegador bloquea los módulos JavaScript.

## Fuentes de la información

- **Planes, fichas, puntos de venta, radiofrecuencia, localidades y redes aliadas:** portal cautivo MultiNet v36 (`herzsa_isp_control/Portal Cautivo/roaming-portal-20261112-v36/login.html`).
- **Diseño de la página principal:** muestra `imagenes/pgnw.png`. La foto `assets/images/hero-atardecer.webp` se recortó de esa muestra (se borró el logotipo incrustado); conviene sustituirla por la foto original en alta resolución con el mismo nombre.
- **Logotipo plano:** `logo-herzsa-azul.svg` y `logo-herzsa-blanco.svg`, redibujados en vectores a partir de la muestra.
- **Logotipos:** `herzsa.webp` y `multinet.webp` del mismo portal; icono de HerzSA TV de `Herzsanet_Iptv_apli/herzsa-tv-roku/images/icono_fhd.png`.
- **Funcionamiento de HerzSA TV (aviso de privacidad §5):** código de la app Roku v1.0.13 (`Herzsanet_Iptv_apli/herzsa-tv-roku`). Si la app cambia, revise ese apartado.

## Cómo editar datos

1. **Todo en `assets/js/config.js`:** contacto, planes (`plans`), fichas (`vouchers`), puntos de venta (`salesPoints`), paquetes de radio (`radioPackages`), redes aliadas (`allies`), localidades (`coverage`) y estado de la app. Un valor `null` o una lista vacía se muestra como «Pendiente de confirmar», y los botones de correo, WhatsApp y teléfono quedan deshabilitados hasta tener datos.
2. **Cobertura:** cada localidad es `["Nombre", ["id-de-red", ...]]`; los `id` son los de `allies`. Los colores de cada red solo sirven para distinguirlas en el sitio y no son colores oficiales de esas marcas.
3. **Logotipos:** reemplace los archivos de `assets/images/` conservando el nombre.
4. **Textos legales:** edite `privacidad/index.html` y `terminos/index.html` y busque `PENDIENTE DE CONFIRMAR`.
5. **URL pública:** si no se publica en `https://herzsa.net/`, actualice `siteUrl` en `config.js`, `sitemap.xml`, `robots.txt` y las etiquetas `canonical`/`og:url` de cada página.
6. **Cuando Roku apruebe la app:** en `config.js` ponga `apps.roku.status: "publicada"` y `storeUrl`, y revise los textos fijos «en proceso de publicación» de `herzsa-tv/index.html` y `soporte/index.html`.

## Información pendiente de confirmar

| Dato | Dónde |
|---|---|
| Nombre o razón social, domicilio y correo de privacidad/ARCO | `config.js` → `legal` |
| Correo de soporte, teléfono, WhatsApp, horario y oficina | `config.js` → `contact` |
| Redes sociales | `config.js` → `social` |
| Precio de los equipos de radio (paquetes A y B) | `config.js` → `radioPackages` |
| Modelos de Roku compatibles | `herzsa-tv/index.html` |
| Uso de HerzSA TV fuera de la red HerzSA.Net; sesiones simultáneas | `herzsa-tv/`, `terminos/` |
| Cifrado de la conexión app ↔ servidor de TV | `privacidad/` §5.1 |
| Registros que guardan los servidores y su plazo | `privacidad/` §2.2, §5.3, §8 |
| Datos de clientes de Internet y finalidades adicionales | `privacidad/` §2.1, §3 |
| Proveedores (servidor de TV, panel, facturación, mensajería) | `privacidad/` §6 |
| Transferencias (incluido el intercambio de autenticación en MultiNet) | `privacidad/` §7 |
| Medidas de seguridad adicionales | `privacidad/` §9 |
| Jurisdicción competente | `terminos/` §12 |
| Fecha de última actualización y aprobación legal | `config.js` → `legal.lastUpdated`, `legal.approved` |
| Imagen para redes sociales (`og:image`, PNG 1200×630) | Todas las páginas (opcional) |

> Los documentos legales son **borradores** y no constituyen asesoría legal. Mientras `legal.approved` sea `false` muestran un aviso de borrador. No los envíe a Roku como definitivos hasta completar y revisar los pendientes.

## Publicación en GitHub Pages

Requiere su autorización: estos comandos crean un repositorio **público** en su cuenta.

```bash
cd Pagina_Web_Nueva
git add .
git commit -m "Sitio oficial HerzSA.Net"
gh repo create herzSA-Net/herzsa.net --public --source=. --remote=origin --push
gh api -X POST repos/herzSA-Net/herzsa.net/pages \
  -f "source[branch]=main" -f "source[path]=/"
```

Si GitHub ya activó Pages automáticamente, el último comando responde que ya existe; no es un error. Para verificar:

```bash
gh api repos/herzSA-Net/herzsa.net/pages --jq '.status, .html_url'
curl -I https://herzsa.net/
```

**Desde el navegador:** cree un repositorio público llamado `herzsa.net`, suba el contenido de esta carpeta (raíz) y en *Settings → Pages* elija *Deploy from a branch*, rama `main`, carpeta `/ (root)`. Active *Enforce HTTPS*.

**Dominio propio (opcional):** si se usará un dominio como `herzsa.net`, configúrelo en *Settings → Pages → Custom domain* (GitHub crea el archivo `CNAME`), apunte el DNS según la documentación de GitHub y actualice las URL indicadas en «Cómo editar datos», paso 4.

## URL para Roku Developer

Válidas una vez publicado y verificado el sitio en `https://herzsa.net/`:

| Campo | URL |
|---|---|
| Developer Website | https://herzsa.net/ |
| Privacy Policy | https://herzsa.net/herzsa-tv/privacidad/ |
| Terms of Use | https://herzsa.net/herzsa-tv/terminos/ |
| Customer Support URL | https://herzsa.net/herzsa-tv/soporte/ |
| More Information URL | https://herzsa.net/herzsa-tv/ |

## Descargas de HerzSA TV

| Plataforma | Versión | Archivo | Origen |
|---|---|---|---|
| Android | 1.5.5 | `assets/descargas/HerzSA-TV-1.5.5.apk` (4.7 MB) | `Herzsanet_Iptv_apli/herzsa-tv-android/releases/` |
| Roku | 1.1.2 | `assets/descargas/HerzSA-TV-Roku-1.1.2.zip` (1 MB) | `Herzsanet_Iptv_apli/herzsa-tv-roku/releases/` |
| Samsung (Tizen) | 1.1.2 | `assets/descargas/HerzSA-TV-Samsung-1.1.2-proyecto.zip` y `.wgt` sin firmar (0.7 MB) | `Herzsanet_Iptv_apli/herzsa-tv-samsung/releases/` |
| Windows | 1.3.2 | Enlace al panel: `https://control-isp.herdzsa.net/static/downloads/windows/HerzSA-TV-Windows-1.3.2.exe` | El `.exe` pesa 117 MB y GitHub no admite archivos de más de 100 MB en un repositorio |

Para publicar una versión nueva: copie el archivo a `assets/descargas/` (o cambie el enlace de Windows), borre el anterior y actualice en `herzsa-tv/descargar/index.html` el nombre del archivo, la versión, el tamaño y la huella SHA-256 (`sha256sum archivo`), y la versión que se menciona en `herzsa-tv/index.html` y en los avisos de privacidad.

## Seguridad

Este repositorio es público. No suba contraseñas, tokens, credenciales Xtream Codes, configuraciones de MikroTik o RADIUS, IP de administración, archivos `.env` ni datos bancarios o fiscales. El sitio no tiene formularios ni autenticación de clientes.
