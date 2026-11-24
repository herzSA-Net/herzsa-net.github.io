/**
 * CONFIGURACIÓN CENTRAL DEL SITIO HERZSA.NET
 * ------------------------------------------------------------
 * Este es el ÚNICO archivo que debe editarse para cambiar datos
 * de contacto, precios, cobertura, aliados y disponibilidad de apps.
 *
 * Fuente de planes, fichas, puntos de venta, servicios, cobertura y
 * aliados: portal cautivo MultiNet v36 (herzsa_isp_control,
 * "Portal Cautivo/roaming-portal-20261112-v36/login.html").
 *
 * Reglas:
 *  - Un valor `null` (o lista vacía) significa PENDIENTE DE CONFIRMAR.
 *    El sitio lo mostrará como "Pendiente de confirmar" y deshabilitará
 *    los botones relacionados. Nunca escriba datos de ejemplo aquí.
 *  - No coloque contraseñas, tokens, IPs de administración, datos de
 *    RADIUS/MikroTik ni credenciales Xtream Codes. Este archivo es PÚBLICO.
 */
export const config = {
  // --- Identidad -----------------------------------------------------
  brand: {
    name: "HerzSA.Net",
    tagline: "Multiconexiones",
    multinet: "MultiNet",
    tv: "HerzSA TV",
  },

  // URL pública definitiva (con "/" final). Provisional hasta confirmar.
  // Si cambia, actualice también sitemap.xml, robots.txt y canonical/og:url.
  siteUrl: "https://herzsa.net/",

  // --- Responsable legal (aviso de privacidad / términos) -------------
  legal: {
    ownerName: "Silverio Hernandez Cruz",
    ownerAddress: "Calle Deportiva S/N, Gral. Emiliano Zapata El Pescadito, Uxpanapa, Ver.",
    privacyEmail: "herznetmultiservicios@gmail.com",
    approved: true,         // Textos aprobados por el responsable (24-nov-2026); se recomienda revisión legal
    lastUpdated: "24 de noviembre de 2026",
  },

  // --- Contacto ------------------------------------------------------
  contact: {
    supportEmail: "herznetmultiservicios@gmail.com",
    phone: "921 326 2343",
    whatsapp: "+52 921 326 2343",   // el enlace usa solo los dígitos (529213262343)
    hours: "Lunes a viernes de 13:00 a 18:00; sábados y domingos de 8:00 a 18:00",
    address: "Calle Deportiva S/N, Gral. Emiliano Zapata El Pescadito, Uxpanapa, Ver.",
  },

  social: {
    facebook: null,
    instagram: null,
    tiktok: null,
    youtube: null,
  },

  // --- Planes residenciales -------------------------------------------
  currency: "MXN",
  installationCost: 500,
  plans: [
    {
      id: "basico", tone: "blue", name: "Plan Básico", subtitle: "Para tu hogar", speed: "80 Mbps", price: 300,
      description: "Perfecto para navegación ligera en el hogar.",
      features: ["Un Usuario Local HerzSA.Net", "Sin límite de dispositivos", "IPTV por $40 adicionales"],
    },
    {
      id: "lite", tone: "green", badge: "IPTV incluido", name: "Plan Lite", subtitle: "Hogar y streaming", speed: "100 Mbps", price: 400,
      description: "Navegación para todo el hogar y streaming.",
      features: ["Internet ilimitado", "Un Usuario Plus MultiNet", "Dos Usuarios Locales HerzSA.Net", "IPTV incluido"],
      highlight: true,
    },
    {
      id: "plus", tone: "orange", badge: "Máximo rendimiento", name: "Plan Plus", subtitle: "Máximo rendimiento", speed: "150 Mbps", price: 500,
      description: "Para navegación exigente.",
      features: ["Internet sin límite", "Dos Usuarios Plus MultiNet", "Dos Usuarios Locales HerzSA.Net", "IPTV incluido"],
    },
  ],

  // --- Fichas (hotspot) -------------------------------------------------
  // type: "pausado" = hasta 24 h para consumir el tiempo; "corrido" = corre desde que se ingresa.
  vouchers: [
    { name: "1 Hora", price: 10, type: "pausado" },
    { name: "5 Horas", price: 15, type: "pausado" },
    { name: "1 Día", price: 30, type: "corrido" },
    { name: "7 Días", price: 90, type: "corrido" },
    { name: "30 Días", price: 200, type: "corrido" },
  ],

  // --- Puntos de venta de fichas ---------------------------------------
  salesPoints: [
    { locality: "Emiliano Zapata (El Pescadito)", store: "Abarrotes Salomón" },
    { locality: "Emiliano Zapata (El Pescadito)", store: "Casa Oswaldo" },
    { locality: "Ejido El Arenal", store: "Tienda Flor" },
    { locality: "Lázaro Cárdenas", store: "Casa Kiko" },
    { locality: "Dos Amates", store: "Familia Cáceres Don Polo" },
    { locality: "Cahuapa", store: "Taller de motos Kenzy" },
    { locality: "Vidal Díaz Muñoz", store: "Casa Doña Delfina" },
    { locality: "Benito Juárez", store: "Casa Sergio" },
  ],

  // --- Radiofrecuencia VHF (solo clientes con contrato de Internet activo) ---
  radioPackages: [
    { name: "Paquete A", tone: "blue", radios: 2, title: "2 radios", detail: "2 radios Baofeng UV82 frecuenciados.", extra: "Mantenimiento anual del repetidor incluido ($500/año)" },
    { name: "Paquete B", tone: "green", radios: 3, title: "3 radios", detail: "3 radios Baofeng UV82 frecuenciados.", extra: "Mantenimiento anual del repetidor incluido ($500/año)", badge: "Más popular" },
    { name: "Paquete C", tone: "purple", radios: 1, title: "Tu propio radio", detail: "Para quienes ya tienen radio o desean comprarlo por su cuenta. Configuración incluida (VHF).", extra: "Mantenimiento: $500/año adicional" },
  ],

  // --- Redes aliadas MultiNet (publicadas en el portal cautivo) -------
  allies: [
    { id: "citynet", name: "City.Net", color: "#2F80ED" },
    { id: "festivalito", name: "Festivalito", color: "#E2574C" },
    { id: "redacg", name: "REDAC&G", color: "#8E5CD9" },
    { id: "herzsa", name: "HerzSA.Net", color: "#248A72" },
    { id: "redbravo", name: "RED BRAVO", color: "#C0392B" },
    { id: "redexpres", name: "REDEXPRES", color: "#E67E22" },
    { id: "wds", name: "Wireless-Del-Sur", short: "WDS", color: "#1F9BB5" },
    { id: "alis", name: "ALIS", color: "#D4A017" },
    { id: "ppnetwork", name: "PPNETWORK", color: "#5B6C8F" },
  ],

  // --- Localidades con punto de acceso MULTINET_ ----------------------
  coverage: [
    ["Adolfo Ruiz Cortines", ["wds"]],
    ["Bajo Grande", ["redacg"]],
    ["Belisario Domínguez", ["wds"]],
    ["Benito Juárez Pob. 1", ["redbravo"]],
    ["Benito Juárez Primero", ["redexpres", "herzsa"]],
    ["Benito Juárez Segundo (La Raya)", ["citynet", "alis"]],
    ["Buena Vista", ["ppnetwork"]],
    ["Cahuapan", ["wds"]],
    ["Cándido Aguilar", ["ppnetwork"]],
    ["Carolino Anaya", ["redbravo"]],
    ["Chuniapan de Arriba", ["wds"]],
    ["Del Valle Pob. 13", ["ppnetwork"]],
    ["Ejido Dos Amates", ["herzsa", "redexpres"]],
    ["Ejido El Arenal", ["herzsa", "alis"]],
    ["Ejido Lázaro Cárdenas", ["herzsa"]],
    ["El Luchador", ["redacg"]],
    ["Fernando López Arias", ["redexpres"]],
    ["Helio García Alfaro Pob. 11", ["ppnetwork"]],
    ["Hermanos Cedillo", ["redacg"]],
    ["Javier Rojo Gómez", ["wds"]],
    ["Jorge L. Tamayo", ["ppnetwork"]],
    ["La Chinantla Pob. 10", ["citynet", "festivalito", "alis"], "bugambilias"],
    ["La Fortaleza", ["ppnetwork"]],
    ["La Galera", ["wds"]],
    ["La Horqueta Pob. 12", ["ppnetwork"]],
    ["La Laguna", ["citynet"]],
    ["Las Joyas", ["ppnetwork"]],
    ["Las Palmas", ["ppnetwork"]],
    ["Los Amarillos Pob. 15", ["ppnetwork"]],
    ["Los Liberales", ["ppnetwork"]],
    ["Luis Echeverría Álvarez", ["herzsa"]],
    ["Miguel Alemán", ["redacg"]],
    ["Niños Héroes Los Juanes", ["wds"]],
    ["Nuevo Cantón Pob. 7", ["alis"]],
    ["Nuevo Córdoba", ["ppnetwork"]],
    ["Paso de Moral", ["redacg"]],
    ["Plan de Arroyo", ["redacg"]],
    ["Plan de Pericos", ["redexpres"]],
    ["Poblado 2", ["redacg"]],
    ["Poblado 3", ["redacg"]],
    ["Poblado 6", ["citynet"]],
    ["Poblado Cinco", ["redacg"]],
    ["Rancho El Chorrito", ["herzsa"]],
    ["Rancho La Ceiba", ["herzsa"]],
    ["Río Uxpanapa Pob. 14", ["redbravo", "ppnetwork"]],
    ["San Antonio Chimalapa", ["redacg"]],
    ["San Francisco La Paz", ["ppnetwork"]],
    ["Saturnino Cedillo", ["redbravo"]],
    ["Valerio Trujano", ["ppnetwork"]],
    ["Vicente Guerrero", ["redexpres"]],
    ["Vidal Díaz Muñoz", ["redacg", "herzsa"]],
    ["Zapata Anexo", ["herzsa"]],
    ["Zapata Pescadito", ["herzsa"]],
  ],

  // --- Aplicaciones ---------------------------------------------------
  // status: "en-desarrollo" | "en-revision" | "publicada"
  apps: {
    roku: { status: "en-revision", storeUrl: null },
  },
};
