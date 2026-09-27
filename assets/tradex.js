/* ==========================================================================
   Tradex — Prototype runtime (v0.1)
   - Injects the prototype toolbar and the Storefront / ERP / Vendor shells
   - Holds the shared sample catalogue and reference data
   - Wires all interactions by event delegation (tabs, modals, drawers,
     dropdowns, quantity steppers, cart, wishlist, compare, toasts)
   - Provides small SVG chart helpers (line, horizontal bars, stacked, spark)

   Page contract:
     <body data-app="store|erp|vendor|hub" data-page="<page id>">
       <main> ...page content... </main>
       <script src="assets/tradex.js"></script>
       <script> TX.ready(() => { ...page script... }) </script>
   ========================================================================== */
(function () {
  "use strict";
  const TX = (window.TX = {});
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  TX.$ = $; TX.$$ = $$;

  /* ------------------------------------------------------------------------ */
  /* Icons (24×24, stroke)                                                     */
  /* ------------------------------------------------------------------------ */
  const I = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    cart: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    package: '<path d="M16.5 9.4 7.55 4.24"/><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.29 7 12 12l8.71-5"/><path d="M12 22V12"/>',
    truck: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
    shield: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
    refresh: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    star: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    "chevron-down": '<path d="m6 9 6 6 6-6"/>',
    "chevron-up": '<path d="m18 15-6-6-6 6"/>',
    "chevron-right": '<path d="m9 18 6-6-6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    "arrow-right": '<path d="M5 12h14M12 5l7 7-7 7"/>',
    "arrow-left": '<path d="M19 12H5M12 19l-7-7 7-7"/>',
    "arrow-up-right": '<path d="M7 17 17 7M7 7h10v10"/>',
    "trending-up": '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    "trending-down": '<path d="m22 17-8.5-8.5-5 5L2 7"/><path d="M16 17h6v-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    pin: '<path d="M20 10c0 4.99-5.54 10.19-7.4 11.8a1 1 0 0 1-1.2 0C9.54 20.19 4 14.99 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/>',
    bell: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    filter: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    dashboard: '<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
    warehouse: '<path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"/><path d="M6 18h12M6 14h12"/><rect x="6" y="10" width="12" height="12"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4M12 16h4M8 11h.01M8 16h.01"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8M12 17.5v-11"/>',
    tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r="1"/>',
    store: '<path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2.7 2.7 0 0 1-2-1 2.7 2.7 0 0 1-2 1 2 2 0 0 1-2-2V7"/>',
    card: '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M2 10h20"/>',
    wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    chat: '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    whatsapp: '<path d="M3.5 20.5 4.8 16A8.5 8.5 0 1 1 8 19.2Z"/><path d="M9 8.6c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.7l-.5.6c-.1.1-.1.3 0 .5a5.6 5.6 0 0 0 2.6 2.4c.2.1.4.1.5-.1l.6-.7c.2-.2.4-.2.7-.1l1.5.7c.3.1.4.3.4.5v.5c0 .4-.2.8-.6 1-.6.3-1.4.4-2.2.1a9 9 0 0 1-4.9-4.6c-.4-.9-.5-1.9-.1-2.5z"/>',
    chart: '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    zap: '<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
    lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
    "alert-octagon": '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><path d="M12 8v4M12 16h.01"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    "check-circle": '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    "x-circle": '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    calendar: '<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M8 7v10M12 7v10M17 7v10"/>',
    transfer: '<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>',
    undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5 5.5 5.5 0 0 1-5.5 5.5H11"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    briefcase: '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    percent: '<path d="M19 5 5 19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>',
    eye: '<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
    "eye-off": '<path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61A13.53 13.53 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61M2 2l20 20M14.12 14.12a3 3 0 1 1-4.24-4.24"/>',
    edit: '<path d="M21.17 6.81a1 1 0 0 0-3.99-3.99L3.84 16.17a2 2 0 0 0-.5.83l-1.32 4.35a.5.5 0 0 0 .62.62l4.35-1.32a2 2 0 0 0 .83-.5z"/>',
    trash: '<path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    "more-v": '<circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/>',
    external: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
    logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .71-1.53l7-6a2 2 0 0 1 2.58 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/>',
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    compare: '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M11 18H8a2 2 0 0 1-2-2V9"/>',
    sparkles: '<path d="M9.94 14.06 8 20l-1.94-5.94L0 12l6.06-1.94L8 4l1.94 6.06L16 12z" transform="translate(2 -1) scale(.9)"/><path d="M19 3v4M17 5h4"/>',
    activity: '<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>',
    layers: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65M22 12.65l-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    play: '<polygon points="6 3 20 12 6 21 6 3"/>',
    pause: '<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>',
    copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    sort: '<path d="m21 16-4 4-4-4M17 20V4M3 8l4-4 4 4M7 4v16"/>',
    history: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
    inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
    send: '<path d="M14.54 21.69a.5.5 0 0 0 .94-.03l6.5-19a.5.5 0 0 0-.64-.64l-19 6.5a.5.5 0 0 0-.03.94l7.93 3.18a2 2 0 0 1 1.11 1.11z"/><path d="m21.85 2.15-10.94 10.94"/>',
    paperclip: '<path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/>',
    image: '<rect width="18" height="18" x="3" y="3" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0"/>',
    server: '<rect width="20" height="8" x="2" y="2" rx="2"/><rect width="20" height="8" x="2" y="14" rx="2"/><path d="M6 6h.01M6 18h.01"/>',
    printer: '<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
    laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
    monitor: '<rect width="20" height="14" x="2" y="3" rx="2"/><path d="M8 21h8M12 17v4"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    aperture: '<circle cx="12" cy="12" r="10"/><path d="m14.31 8 5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16 3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"/>',
    drive: '<path d="M22 12H2M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11zM6 16h.01M10 16h.01"/>',
    mouse: '<rect x="5" y="2" width="14" height="20" rx="7"/><path d="M12 6v4"/>',
    keyboard: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 12h.01M12 12h.01M16 12h.01M7 16h10"/>',
    wifi: '<path d="M12 20h.01M2 8.82a15 15 0 0 1 20 0M5 12.86a10 10 0 0 1 14 0M8.5 16.43a5 5 0 0 1 7 0"/>',
    cpu: '<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/>',
    smartphone: '<rect width="14" height="20" x="5" y="2" rx="2"/><path d="M12 18h.01"/>',
    tablet: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M12 18h.01"/>',
    watch: '<circle cx="12" cy="12" r="6"/><path d="M12 10v2l1 1M16.13 7.66l-.81-4.05a2 2 0 0 0-2-1.61h-2.68a2 2 0 0 0-2 1.61l-.78 4.05M7.88 16.36l.8 4a2 2 0 0 0 2 1.61h2.72a2 2 0 0 0 2-1.61l.81-4.05"/>',
    speaker: '<rect width="16" height="20" x="4" y="2" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M12 6h.01"/>',
    tower: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M10 6h4M10 10h4M12 17h.01"/>',
    box: '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/>',
    qr: '<rect width="5" height="5" x="3" y="3" rx="1"/><rect width="5" height="5" x="16" y="3" rx="1"/><rect width="5" height="5" x="3" y="16" rx="1"/><path d="M21 16h-3a2 2 0 0 0-2 2v3M21 21v.01M12 7v3a2 2 0 0 1-2 2H7M3 12h.01M12 3h.01M12 16v.01M16 12h1M21 12v.01M12 21v-1"/>',
    rupee: '<path d="M6 3h12M6 8h12M6 13l8.5 8M6 13h3M9 13c6.67 0 6.67-10 0-10"/>',
    help: '<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    route: '<circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"/><circle cx="18" cy="5" r="3"/>',
    toggle: '<rect width="20" height="12" x="2" y="6" rx="6"/><circle cx="16" cy="12" r="2"/>',
    split: '<path d="M16 3h5v5M8 3H3v5M12 22v-8.3a4 4 0 0 0-1.17-2.83L3 3M15 9l6-6"/>',
    thumbs: '<path d="M7 10v12M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z"/>',
    certificate: '<path d="M4 4h16v12H4z"/><path d="M8 8h8M8 12h5"/><circle cx="17" cy="17" r="3"/><path d="m15.5 19.5-.5 2.5 2-1 2 1-.5-2.5"/>',
  };
  TX.icons = I;
  TX.icon = (name, cls = "") => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${I[name] || ""}</svg>`;
  const ic = TX.icon;
  TX.logoMark = () => `<span class="logo-mark"><svg viewBox="0 0 24 24"><path d="M6 6l6 6-6 6"/><path d="M18 6l-6 6 6 6"/></svg></span>`;
  TX.logo = (sub) => `<a class="logo" href="store-home.html">${TX.logoMark()}<span><span class="logo-word">trade<b>x</b></span>${sub ? `<div class="logo-sub">${sub}</div>` : ""}</span></a>`;

  /* ------------------------------------------------------------------------ */
  /* Formatting helpers                                                        */
  /* ------------------------------------------------------------------------ */
  TX.fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
  TX.fmtK = (n) => (n >= 1e7 ? "₹" + (n / 1e7).toFixed(2) + " Cr" : n >= 1e5 ? "₹" + (n / 1e5).toFixed(1) + " L" : n >= 1e3 ? "₹" + (n / 1e3).toFixed(1) + "K" : "₹" + n);
  TX.num = (n) => Math.round(n).toLocaleString("en-IN");
  TX.param = (k) => new URLSearchParams(location.search).get(k);
  TX.img = (key) => `assets/img/${key}.jpg`;
  TX.ph = (key, cls = "", alt = "") => `<div class="ph ${cls}"><img src="${TX.img(key)}" alt="${alt}" loading="lazy"></div>`;
  TX.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ------------------------------------------------------------------------ */
  /* Reference data                                                            */
  /* ------------------------------------------------------------------------ */
  TX.conditions = {
    new: { label: "New", cls: "new", note: "Sealed box, manufacturer warranty" },
    openbox: { label: "Open box", cls: "openbox", note: "Unused, packaging opened, fully tested" },
    "refurb-a": { label: "Refurbished · Grade A", cls: "refurb", note: "Minimal signs of use, 42-point inspection" },
    "refurb-b": { label: "Refurbished · Grade B", cls: "refurb", note: "Light visible wear, fully functional" },
    used: { label: "Used · Good", cls: "used", note: "Pre-owned, tested, cosmetic wear described" },
  };

  TX.categories = [
    { id: "laptops", name: "Laptops", img: "lap-dell", icon: "laptop", count: 412 },
    { id: "desktops", name: "Desktops & builds", img: "pc-case", icon: "tower", count: 138 },
    { id: "monitors", name: "Monitors", img: "mon-curved", icon: "monitor", count: 164 },
    { id: "components", name: "Components", img: "gpu-tuf", icon: "cpu", count: 526 },
    { id: "storage", name: "Storage & memory", img: "ssd-t5top", icon: "drive", count: 301 },
    { id: "cameras", name: "Cameras", img: "cam-canon6d", icon: "camera", count: 97 },
    { id: "lenses", name: "Lenses", img: "lens-white", icon: "aperture", count: 84 },
    { id: "accessories", name: "Keyboards & mice", img: "kb-keychron", icon: "keyboard", count: 389 },
    { id: "audio", name: "Audio", img: "hp-sony", icon: "headset", count: 176 },
    { id: "networking", name: "Networking", img: "router-asus", icon: "wifi", count: 122 },
    { id: "printers", name: "Printers", img: "printer-hp", icon: "printer", count: 58 },
    { id: "mobile", name: "Tablets, phones & wearables", img: "tab-ipad", icon: "tablet", count: 143 },
  ];

  const D = { tue: "Tue, 29 Sep", wed: "Wed, 30 Sep", thu: "Thu, 1 Oct", fri: "Fri, 2 Oct", mon: "Mon, 5 Oct" };
  // stock: in | low | supplier | out     cond: key of TX.conditions
  const P = [
    // Laptops
    ["lap-01", "laptops", "Dell", "Dell Latitude 5420 14\" FHD Business Laptop", "Core i5-1145G7 · 16 GB · 512 GB SSD · Win 11 Pro", "refurb-a", 38990, 72000, "lap-dell", ["lap-dell", "lap-side", "lap-grey"], "in", 12, D.tue, "6-month Tradex warranty", 4.5, 214, "Best seller"],
    ["lap-02", "laptops", "Lenovo", "Lenovo ThinkPad T14 Gen 2 14\" Laptop", "Ryzen 5 PRO 5650U · 16 GB · 256 GB SSD", "refurb-b", 32490, 68000, "lap-thinkpad", ["lap-thinkpad", "lap-thinkpad2"], "in", 9, D.tue, "6-month Tradex warranty", 4.3, 128],
    ["lap-03", "laptops", "Apple", "Apple MacBook Air 13.6\" M2 (2022)", "Apple M2 · 8 GB · 256 GB SSD · Midnight", "openbox", 84990, 99900, "lap-mac-air", ["lap-mac-air", "lap-mac-back", "lap-open"], "low", 2, D.wed, "Apple 1-year warranty", 4.8, 96],
    ["lap-04", "laptops", "ASUS", "ASUS TUF Gaming F15 15.6\" 144 Hz Gaming Laptop", "Core i7-12700H · RTX 3050 · 16 GB · 512 GB", "new", 72990, 89990, "lap-tuf", ["lap-tuf"], "in", 18, D.tue, "ASUS 1-year warranty", 4.4, 342, "Deal"],
    ["lap-05", "laptops", "HP", "HP Pavilion 15 Thin & Light Laptop", "Core i5-1335U · 16 GB · 512 GB SSD · FHD IPS", "new", 58990, 71999, "lap-stack", ["lap-stack"], "in", 24, D.tue, "HP 1-year warranty", 4.2, 188],
    ["lap-06", "laptops", "ASUS", "ASUS Zenbook Pro 14 Duo OLED Creator Laptop", "Core i9-13900H · RTX 4060 · 32 GB · 1 TB", "new", 179990, 219990, "lap-duo", ["lap-duo"], "supplier", 0, D.fri, "ASUS 2-year warranty", 4.6, 41],
    ["lap-07", "laptops", "Lenovo", "Lenovo Yoga Book 9i Dual-Screen OLED", "Core i7-1355U · 16 GB · 1 TB SSD", "openbox", 124990, 159990, "lap-yoga", ["lap-yoga"], "low", 1, D.wed, "Lenovo 1-year warranty", 4.1, 17],
    ["lap-08", "laptops", "Apple", "Apple MacBook Pro 14\" M1 Pro", "M1 Pro 10-core · 16 GB · 512 GB SSD", "refurb-a", 104990, 194900, "lap-side", ["lap-side", "lap-mac-back"], "in", 5, D.wed, "6-month Tradex warranty", 4.7, 63],
    // Desktops
    ["pc-01", "desktops", "Tradex Builds", "Tradex Creator Workstation — Custom Build", "Ryzen 7 7700 · RTX 4070 · 32 GB DDR5 · 1 TB NVMe", "new", 139990, 154990, "pc-case", ["pc-case", "mobo-tuf", "gpu-tuf"], "in", 4, D.thu, "3-year Tradex build warranty", 4.9, 38, "Built to order"],
    ["pc-02", "desktops", "Tradex Builds", "Tradex Esports Gaming PC", "Core i5-13400F · RTX 4060 · 16 GB · 1 TB NVMe", "new", 89990, 99990, "pc-case2", ["pc-case2"], "in", 6, D.thu, "3-year Tradex build warranty", 4.7, 52],
    ["pc-03", "desktops", "Tradex Builds", "Compact Mini-ITX Office Workstation", "Core i7-13700 · 32 GB · 1 TB SSD · Wi-Fi 6", "new", 112500, 124000, "pc-sff", ["pc-sff"], "supplier", 0, D.mon, "3-year Tradex build warranty", 4.5, 12],
    ["pc-04", "desktops", "Apple", "Apple iMac 24\" 4.5K Retina M1", "Apple M1 · 8 GB · 256 GB · Silver", "refurb-a", 79990, 129900, "imac", ["imac", "pc-setup-white"], "in", 3, D.wed, "6-month Tradex warranty", 4.6, 29],
    // Monitors
    ["mon-01", "monitors", "Xiaomi", "Xiaomi Mi 34\" Curved Gaming Monitor WQHD 144 Hz", "3440×1440 · VA · 1500R · FreeSync", "new", 29999, 39999, "mon-curved", ["mon-curved"], "in", 15, D.tue, "Xiaomi 1-year warranty", 4.4, 410, "Deal"],
    ["mon-02", "monitors", "Samsung", "Samsung Odyssey G5 34\" Curved WQHD 165 Hz", "3440×1440 · VA · HDR10 · 1 ms", "openbox", 27490, 45000, "mon-curved2", ["mon-curved2"], "low", 2, D.wed, "Samsung 1-year warranty", 4.3, 77],
    ["mon-03", "monitors", "Dell", "Dell UltraSharp U2723QE 27\" 4K USB-C Hub Monitor", "3840×2160 · IPS Black · 90 W USB-C", "new", 46990, 58000, "mon-pink", ["mon-pink"], "in", 11, D.tue, "Dell 3-year warranty", 4.8, 156],
    ["mon-04", "monitors", "LG", "LG 27UL550 27\" 4K UHD HDR10 Monitor", "3840×2160 · IPS · AMD FreeSync", "refurb-b", 16990, 32000, "mon-setup", ["mon-setup"], "in", 7, D.wed, "3-month Tradex warranty", 4.1, 58],
    // Components
    ["gpu-01", "components", "ASUS", "ASUS TUF Gaming GeForce RTX 4070 Ti 12 GB OC", "12 GB GDDR6X · DLSS 3 · Triple fan", "new", 79990, 89990, "gpu-tuf", ["gpu-tuf"], "in", 8, D.tue, "ASUS 3-year warranty", 4.8, 91],
    ["gpu-02", "components", "GIGABYTE", "GIGABYTE GeForce RTX 3060 WINDFORCE OC 12 GB", "12 GB GDDR6 · 3× WINDFORCE fans", "refurb-a", 21990, 34990, "gpu-gigabyte", ["gpu-gigabyte"], "in", 6, D.tue, "6-month Tradex warranty", 4.4, 73],
    ["gpu-03", "components", "NVIDIA", "NVIDIA GeForce RTX 2080 Founders Edition", "8 GB GDDR6 · Dual axial fans", "used", 27990, 69990, "gpu-fe", ["gpu-fe"], "low", 1, D.wed, "3-month Tradex warranty", 4.2, 22],
    ["cpu-01", "components", "AMD", "AMD Ryzen 7 7700X Desktop Processor", "8 cores · 16 threads · up to 5.4 GHz · AM5", "new", 29490, 36990, "cpu-ryzen", ["cpu-ryzen"], "in", 21, D.tue, "AMD 3-year warranty", 4.8, 267],
    ["cpu-02", "components", "Intel", "Intel Core i5-12400F Desktop Processor", "6 cores · 12 threads · up to 4.4 GHz · LGA1700", "new", 11990, 16500, "cpu-hand", ["cpu-hand"], "in", 34, D.tue, "Intel 3-year warranty", 4.7, 522],
    ["mb-01", "components", "ASUS", "ASUS TUF Gaming Z790-Plus WiFi DDR5 Motherboard", "LGA1700 · DDR5 · PCIe 5.0 · Wi-Fi 6", "new", 24990, 29990, "mobo-tuf", ["mobo-tuf"], "in", 9, D.tue, "ASUS 3-year warranty", 4.5, 84],
    ["cool-01", "components", "ID-COOLING", "ID-COOLING SE-224-XTS Single-Tower CPU Air Cooler", "4 heat pipes · 120 mm PWM fan · AM5/LGA1700", "new", 2190, 2990, "cooler", ["cooler"], "in", 46, D.tue, "1-year warranty", 4.5, 301],
    // Storage & memory
    ["ssd-01", "storage", "Samsung", "Samsung T7 Portable SSD 1 TB USB 3.2 Gen 2", "Up to 1050 MB/s · Aluminium · Indigo blue", "new", 8999, 14999, "ssd-blue", ["ssd-blue", "ssd-t5top"], "in", 63, D.tue, "Samsung 3-year warranty", 4.7, 1204, "Dealer favourite"],
    ["ssd-02", "storage", "Samsung", "Samsung T5 Portable SSD 500 GB", "Up to 540 MB/s · USB-C · Shock resistant", "new", 5499, 8999, "ssd-t5", ["ssd-t5", "ssd-t5top"], "in", 40, D.tue, "Samsung 3-year warranty", 4.6, 856],
    ["ssd-03", "storage", "SanDisk", "SanDisk Extreme Portable SSD 1 TB", "Up to 1050 MB/s · IP65 · Carabiner loop", "new", 8499, 13999, "ssd-sandisk", ["ssd-sandisk"], "in", 38, D.tue, "SanDisk 5-year warranty", 4.6, 690],
    ["hdd-01", "storage", "Seagate", "Seagate BarraCuda 2 TB 3.5\" Internal HDD", "7200 RPM · SATA 6 Gb/s · 256 MB cache", "new", 5299, 6999, "hdd-open", ["hdd-open"], "in", 52, D.tue, "Seagate 2-year warranty", 4.4, 932],
    ["ram-01", "storage", "Kingston", "Kingston FURY Beast 16 GB DDR4 3200 MHz", "Desktop DIMM · CL16 · Heat spreader", "new", 3299, 4499, "ram-kits", ["ram-kits"], "in", 120, D.tue, "Lifetime limited warranty", 4.7, 2110],
    ["ram-02", "storage", "Crucial", "Crucial 16 GB DDR4 3200 MHz Laptop SODIMM", "CL22 · 260-pin · 1.2 V", "new", 2999, 3999, "ram-sodimm", ["ram-sodimm"], "in", 88, D.tue, "Lifetime limited warranty", 4.6, 1480],
    ["usb-01", "storage", "SanDisk", "SanDisk Ultra Flair 64 GB USB 3.0 Pen Drive", "Up to 150 MB/s · Metal casing", "new", 549, 1150, "usb-drive", ["usb-drive"], "in", 400, D.tue, "SanDisk 5-year warranty", 4.5, 5210],
    // Cameras & lenses
    ["cam-01", "cameras", "Canon", "Canon EOS 6D Mark II Full-Frame DSLR (Body)", "26.2 MP · DIGIC 7 · Vari-angle touchscreen", "refurb-a", 84990, 124995, "cam-canon6d", ["cam-canon6d"], "low", 2, D.wed, "6-month Tradex warranty", 4.7, 44],
    ["cam-02", "cameras", "Sony", "Sony Alpha a7 III Mirrorless + 28-70 mm Kit", "24.2 MP full-frame · 4K · 5-axis IBIS", "new", 162990, 184990, "cam-sony", ["cam-sony", "banner-camera"], "in", 5, D.tue, "Sony 2-year warranty", 4.8, 132],
    ["cam-03", "cameras", "Canon", "Canon EOS 80D DSLR + 18-135 mm IS USM", "24.2 MP APS-C · 45-point AF · Wi-Fi", "used", 48990, 99995, "cam-canon80d", ["cam-canon80d"], "in", 3, D.wed, "3-month Tradex warranty", 4.4, 38],
    ["cam-04", "cameras", "Canon", "Canon EOS 1500D DSLR + 18-55 mm Kit", "24.1 MP · Full HD · Wi-Fi & NFC", "new", 38990, 44995, "cam-canon1300", ["cam-canon1300"], "in", 14, D.tue, "Canon 2-year warranty", 4.5, 1840],
    ["cam-05", "cameras", "Fujifilm", "Fujifilm X-T30 II Mirrorless + XF 18-55 mm", "26.1 MP X-Trans 4 · 4K30 · Film simulations", "new", 94999, 104999, "cam-fuji", ["cam-fuji", "cam-fuji2"], "in", 6, D.tue, "Fujifilm 2-year warranty", 4.7, 71],
    ["cam-06", "cameras", "Sony", "Sony Cyber-shot RX100 VII Premium Compact", "20.1 MP 1\" sensor · 24-200 mm · 4K", "openbox", 84990, 104990, "cam-rx100", ["cam-rx100"], "low", 1, D.wed, "Sony 1-year warranty", 4.6, 26],
    ["lens-01", "lenses", "Canon", "Canon EF 16-35 mm f/4L IS USM Lens", "Ultra-wide zoom · 4-stop IS · L-series", "refurb-a", 64990, 94995, "lens-canon", ["lens-canon"], "in", 3, D.wed, "6-month Tradex warranty", 4.8, 35],
    ["lens-02", "lenses", "Canon", "Canon EF 24-105 mm f/4L IS II USM Lens", "Standard zoom · Weather sealed", "used", 52990, 99995, "lens-top", ["lens-top"], "in", 2, D.wed, "3-month Tradex warranty", 4.5, 19],
    ["lens-03", "lenses", "Fujifilm", "Fujinon XF 18-55 mm f/2.8-4 R LM OIS", "Standard zoom · OIS · Linear motor", "openbox", 38990, 54999, "lens-white", ["lens-white"], "in", 4, D.tue, "Fujifilm 1-year warranty", 4.6, 48],
    // Accessories, audio
    ["kb-01", "accessories", "Keychron", "Keychron K2 Wireless Mechanical Keyboard", "75% · Hot-swap · Gateron Brown · RGB", "new", 7499, 8999, "kb-keychron", ["kb-keychron"], "in", 32, D.tue, "1-year warranty", 4.6, 640],
    ["kb-02", "accessories", "Keychron", "Keychron K8 Pro QMK Wireless Keyboard", "TKL · Aluminium frame · Bluetooth 5.1", "new", 10499, 12999, "kb-white", ["kb-white"], "in", 14, D.tue, "1-year warranty", 4.7, 210],
    ["ms-01", "accessories", "Logitech", "Logitech G PRO X Superlight Wireless Mouse", "63 g · HERO 25K · LIGHTSPEED", "new", 11995, 13995, "mouse-black", ["mouse-black"], "in", 19, D.tue, "Logitech 2-year warranty", 4.8, 1320],
    ["ms-02", "accessories", "Logitech", "Logitech G305 LIGHTSPEED Wireless Mouse — White", "HERO 12K · 250 h battery", "new", 3495, 4995, "mouse-white", ["mouse-white"], "in", 71, D.tue, "Logitech 2-year warranty", 4.6, 4210],
    ["ms-03", "accessories", "Logitech", "Logitech M190 Full-Size Wireless Mouse", "Contoured · 18-month battery", "new", 795, 1195, "mouse-logi", ["mouse-logi"], "in", 250, D.tue, "Logitech 1-year warranty", 4.4, 9230],
    ["hub-01", "accessories", "Tradex Essentials", "7-Port USB 3.0 Powered Hub with Switches", "5 Gb/s · Individual power switches · 12 V adapter", "new", 1899, 2999, "hub-usb", ["hub-usb"], "in", 90, D.tue, "1-year warranty", 4.3, 610],
    ["hub-02", "accessories", "Tradex Essentials", "USB-C 6-in-1 Multiport Adapter", "4K HDMI · 100 W PD · SD/microSD · USB-A", "new", 2999, 4499, "hub-usbc", ["hub-usbc"], "in", 64, D.tue, "1-year warranty", 4.4, 480],
    ["chg-01", "accessories", "Baseus", "Baseus 70 W GaN Universal Travel Charger", "2× USB-C · USB-A · Universal plug", "new", 3499, 4999, "charger-gan", ["charger-gan"], "in", 44, D.tue, "1-year warranty", 4.5, 350],
    ["cam-web", "accessories", "Logitech", "Logitech StreamCam Full HD 60 fps Webcam", "1080p60 · USB-C · Auto-framing", "new", 12995, 14995, "webcam-logi", ["webcam-logi"], "in", 12, D.tue, "Logitech 2-year warranty", 4.5, 260],
    ["hp-01", "audio", "Sony", "Sony WH-1000XM4 Wireless Noise-Cancelling Headphones", "Industry-leading ANC · 30 h battery · LDAC", "openbox", 19990, 29990, "hp-sony", ["hp-sony"], "in", 8, D.tue, "Sony 1-year warranty", 4.7, 3120, "Deal"],
    ["hp-02", "audio", "Apple", "Apple AirPods Max — Space Grey", "Active noise cancellation · Spatial audio", "refurb-a", 42990, 59900, "hp-max", ["hp-max"], "low", 2, D.wed, "6-month Tradex warranty", 4.5, 88],
    ["hp-03", "audio", "Sony", "Sony WH-CH720N Wireless ANC Headphones", "Lightweight · 35 h battery · Multipoint", "new", 8990, 14990, "hp-white", ["hp-white"], "in", 36, D.tue, "Sony 1-year warranty", 4.3, 940],
    ["spk-01", "audio", "JBL", "JBL Flip 6 Portable Waterproof Speaker", "IP67 · 12 h playtime · PartyBoost", "new", 9999, 14999, "spk-jbl", ["spk-jbl"], "in", 41, D.tue, "JBL 1-year warranty", 4.6, 2210],
    ["spk-02", "audio", "Bose", "Bose SoundLink Mini II Bluetooth Speaker", "Deep bass · 12 h battery · Charging cradle", "used", 8490, 17900, "spk-bose", ["spk-bose"], "in", 3, D.wed, "3-month Tradex warranty", 4.2, 31],
    // Networking, printers
    ["net-01", "networking", "ASUS", "ASUS RT-AX86U Pro Wi-Fi 6 Gaming Router", "AX5700 dual-band · 2.5 G WAN · AiMesh", "new", 22990, 27990, "router-asus", ["router-asus"], "in", 10, D.tue, "ASUS 3-year warranty", 4.6, 142],
    ["net-02", "networking", "TP-Link", "TP-Link Archer C6 AC1200 Dual-Band Router", "MU-MIMO · 4× Gigabit LAN · 4 antennas", "new", 2799, 4499, "router-white", ["router-white"], "in", 58, D.tue, "TP-Link 3-year warranty", 4.3, 3870],
    ["prn-01", "printers", "HP", "HP Color LaserJet Pro MFP 179fnw", "Print/scan/copy/fax · Wi-Fi · ADF", "new", 31499, 36999, "printer-hp", ["printer-hp"], "in", 7, D.wed, "HP 1-year warranty", 4.3, 204],
    ["prn-02", "printers", "HP", "HP LaserJet Pro MFP M428fdw", "Mono laser · Duplex · 38 ppm", "refurb-b", 29990, 52000, "printer-mfp", ["printer-mfp"], "supplier", 0, D.mon, "3-month Tradex warranty", 4.1, 18],
    // Mobile & wearables
    ["tab-01", "mobile", "Apple", "Apple iPad Air (5th gen) 10.9\" Wi-Fi 64 GB", "M1 chip · Liquid Retina · Space Grey", "openbox", 49990, 59900, "tab-ipad", ["tab-ipad"], "in", 5, D.tue, "Apple 1-year warranty", 4.7, 112],
    ["tab-02", "mobile", "Apple", "Apple iPad 10.2\" (9th gen) Wi-Fi 64 GB", "A13 Bionic · True Tone · Space Grey", "refurb-b", 22990, 33900, "tab-ipad2", ["tab-ipad2"], "in", 9, D.tue, "6-month Tradex warranty", 4.4, 205],
    ["phn-01", "mobile", "Apple", "Apple iPhone 15 Pro 256 GB — Natural Titanium", "A17 Pro · 48 MP · USB-C", "refurb-a", 94990, 144900, "phone", ["phone"], "low", 2, D.wed, "6-month Tradex warranty", 4.6, 57],
    ["wat-01", "mobile", "Apple", "Apple Watch Series 8 GPS 45 mm", "Always-on Retina · ECG · Midnight band", "openbox", 34990, 45900, "watch", ["watch"], "in", 6, D.tue, "Apple 1-year warranty", 4.6, 74],
  ];
  const round10 = (n) => Math.round(n / 10) * 10;
  TX.products = P.map((r) => {
    const [id, cat, brand, title, specs, cond, price, mrp, img, gallery, stock, qty, delivery, warranty, rating, reviews, badge] = r;
    const dealer = round10((price * 0.93) / 1.18); // dealer price shown excl. GST
    return {
      id, cat, brand, title, specs, cond, price, mrp, img, gallery, stock, qty, delivery, warranty, rating, reviews, badge,
      dealer,
      tiers: [{ min: 5, p: round10(dealer * 0.97) }, { min: 10, p: round10(dealer * 0.95) }],
      sku: id.toUpperCase().replace("-", "") + "-" + cond.replace("refurb-", "R").replace("openbox", "OB").replace("new", "N").replace("used", "U").toUpperCase(),
      seller: stock === "supplier" ? "Tradex (ships from partner warehouse)" : "Tradex",
    };
  });
  TX.byId = (id) => TX.products.find((p) => p.id === id) || TX.products[0];
  TX.byCat = (cat) => TX.products.filter((p) => p.cat === cat);

  TX.locations = [
    { code: "WH-BLR", name: "Central Warehouse", city: "Bengaluru", type: "Warehouse" },
    { code: "BR-SPR", name: "SP Road Branch", city: "Bengaluru", type: "Branch" },
    { code: "BR-KRM", name: "Koramangala Branch", city: "Bengaluru", type: "Branch" },
    { code: "BR-MYS", name: "Mysuru Branch", city: "Mysuru", type: "Branch" },
  ];
  TX.staff = [
    { name: "Rajesh Menon", role: "Owner · Super admin", init: "RM", color: "#2e5bff" },
    { name: "Anita Rao", role: "Operations admin", init: "AR", color: "#7c3aed" },
    { name: "Vikram Shetty", role: "Branch manager · SP Road", init: "VS", color: "#0e9f8a" },
    { name: "Deepa Krishnan", role: "Finance", init: "DK", color: "#c2410c" },
    { name: "Mohammed Irfan", role: "Warehouse lead", init: "MI", color: "#0b8ec9" },
    { name: "Sneha Pillai", role: "Catalog specialist", init: "SP", color: "#be185d" },
    { name: "Karthik R", role: "Support executive", init: "KR", color: "#4d7c0f" },
  ];
  TX.vendors = [
    { id: "V-014", name: "Prime IT Distributors", model: "Supplier", city: "Bengaluru", status: "Active", score: 94 },
    { id: "V-022", name: "RenewTech Refurbishers", model: "Supplier · refurbished (fulfilment pilot, 4 SKUs)", city: "Chennai", status: "Active", score: 88 },
    { id: "V-031", name: "CamWorld Imports", model: "Supplier · cameras", city: "Mumbai", status: "Active", score: 91 },
    { id: "V-037", name: "NetCore Solutions", model: "Supplier fulfilment (pilot)", city: "Hyderabad", status: "Pilot", score: 79 },
    { id: "V-041", name: "Digital Hub Traders", model: "Marketplace seller (Phase 2)", city: "Pune", status: "Applied", score: null },
  ];
  TX.dealers = [
    { name: "Metro Computers", contact: "Arun Kumar", city: "Mysuru", list: "Dealer Gold", status: "Approved" },
    { name: "Sai Systems & Services", contact: "Lakshmi Narayan", city: "Tumakuru", list: "Dealer Standard", status: "Approved" },
    { name: "Coastal Infotech", contact: "Faisal Ahmed", city: "Mangaluru", list: "Dealer Gold", status: "Approved" },
    { name: "Byte Point Solutions", contact: "Ramya S", city: "Hubballi", list: "—", status: "Pending review" },
  ];
  TX.people = {
    consumer: { name: "Priya Nair", first: "Priya", email: "priya.nair@example.com" },
    dealer: { name: "Arun Kumar", first: "Arun", org: "Metro Computers", email: "arun@metrocomputers.example" },
  };

  /* ------------------------------------------------------------------------ */
  /* Buyer context (prototype "view as")                                       */
  /* ------------------------------------------------------------------------ */
  const store = {
    get: (k, d) => { try { const v = localStorage.getItem("tx-" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: (k, v) => { try { localStorage.setItem("tx-" + k, JSON.stringify(v)); } catch (e) {} },
  };
  TX.store = store;
  TX.view = store.get("view", "consumer");
  TX.setView = (v) => {
    TX.view = v; store.set("view", v);
    document.body.classList.remove("view-guest", "view-consumer", "view-dealer");
    document.body.classList.add("view-" + v);
    $$("[data-view]").forEach((b) => b.classList.toggle("active", b.dataset.view === v));
    TX.renderPrices(); updateAccountLabel();
    document.dispatchEvent(new CustomEvent("tx:view", { detail: v }));
  };

  /* ------------------------------------------------------------------------ */
  /* Commerce rendering                                                        */
  /* ------------------------------------------------------------------------ */
  TX.condBadge = (cond, extra = "") => { const c = TX.conditions[cond]; return `<span class="cond ${c.cls} ${extra}">${c.label}</span>`; };
  TX.stockHTML = (p) => ({
    in: `<span class="text-ok">${ic("check-circle")} In stock</span>`,
    low: `<span class="text-warn">${ic("clock")} Only ${p.qty} left</span>`,
    supplier: `<span class="text-brand">${ic("truck")} Ships in 4–6 days · partner stock</span>`,
    out: `<span class="text-bad">${ic("x-circle")} Out of stock</span>`,
  }[p.stock]);
  TX.stars = (r) => { let s = ""; for (let i = 1; i <= 5; i++) s += `<svg class="ic ${r >= i - 0.25 ? "" : "off"}" viewBox="0 0 24 24">${I.star}</svg>`; return `<span class="stars">${s}</span>`; };

  TX.priceHTML = (p, size = "") => {
    const off = Math.round((1 - p.price / p.mrp) * 100);
    if (TX.view === "dealer") {
      return `<div class="price ${size}">
        <span class="p-dealer-tag">${ic("briefcase", "ic-sm")} <span><span class="p-org">Metro Computers · </span>Dealer Gold</span></span>
        <div class="p-line"><span class="p-now">${TX.fmt(p.dealer)}</span><span class="p-tax">+ GST · per unit</span></div>
        <span class="p-tier">${TX.fmt(p.tiers[0].p)} at 5+ · ${TX.fmt(p.tiers[1].p)} at 10+</span>
      </div>`;
    }
    return `<div class="price ${size}">
      <div class="p-line"><span class="p-now">${TX.fmt(p.price)}</span><span class="p-mrp">${TX.fmt(p.mrp)}</span><span class="p-off">${off}% off</span></div>
      <span class="p-tax">Inclusive of GST${size === "lg" ? " · Free delivery" : ""}</span>
    </div>`;
  };
  TX.renderPrices = (root = document) => {
    $$("[data-price]", root).forEach((el) => { el.innerHTML = TX.priceHTML(TX.byId(el.dataset.price), el.dataset.size || ""); });
  };

  TX.cardHTML = (p) => {
    const fav = store.get("fav", []).includes(p.id);
    const cmp = store.get("compare", []).includes(p.id);
    return `<article class="pcard" data-id="${p.id}">
      <div class="p-flags">${TX.condBadge(p.cond)}${p.badge ? `<span class="badge b-accent sq">${p.badge}</span>` : ""}</div>
      <button class="p-fav ${fav ? "on" : ""}" data-fav="${p.id}" aria-label="Save to wishlist">${ic("heart")}</button>
      ${TX.ph(p.img, "", TX.esc(p.title))}
      <div class="p-body">
        <div class="p-brand">${p.brand}</div>
        <a class="p-link" href="store-product.html?id=${p.id}"><div class="p-title clamp-2">${TX.esc(p.title)}</div></a>
        <div class="p-specs truncate">${p.specs}</div>
        <div class="p-rating"><span class="rating-pill">${p.rating} <svg class="ic" viewBox="0 0 24 24">${I.star}</svg></span> ${TX.num(p.reviews)} ratings</div>
        <div data-price="${p.id}">${TX.priceHTML(p)}</div>
        <div class="p-meta">${TX.stockHTML(p)}<span>${ic("truck")} <span><span class="m-hide">Delivery </span>by ${p.delivery}</span></span><span>${ic("shield")} ${p.warranty}</span></div>
        <div class="p-foot">
          <label class="p-compare"><input type="checkbox" data-compare="${p.id}" ${cmp ? "checked" : ""}> Compare</label>
          <button class="btn btn-primary btn-sm" data-add="${p.id}">${ic("cart", "ic-sm")} Add</button>
        </div>
      </div>
    </article>`;
  };
  TX.renderGrids = (root = document) => {
    $$("[data-products]", root).forEach((el) => {
      let list = el.dataset.products.startsWith("cat:") ? TX.byCat(el.dataset.products.slice(4)) : el.dataset.products.split(",").map((s) => TX.byId(s.trim()));
      if (el.dataset.limit) list = list.slice(0, +el.dataset.limit);
      el.innerHTML = list.map(TX.cardHTML).join("");
    });
  };

  /* Cart / wishlist / compare state (localStorage) */
  TX.cart = () => store.get("cart", { "lap-01": 1, "ssd-01": 2, "ms-02": 1 });
  TX.setCart = (c) => { store.set("cart", c); updateCartCount(); document.dispatchEvent(new CustomEvent("tx:cart", { detail: c })); };
  TX.addToCart = (id, qty = 1) => { const c = TX.cart(); c[id] = (c[id] || 0) + qty; TX.setCart(c); TX.toast(`Added to cart · ${TX.byId(id).title.slice(0, 38)}…`); };
  function updateCartCount() { const n = Object.values(TX.cart()).reduce((a, b) => a + b, 0); $$("[data-cart-count]").forEach((e) => (e.textContent = n)); }
  function updateCompareTray() {
    const ids = store.get("compare", []);
    const tray = $("#compare-tray"); if (!tray) return;
    tray.classList.toggle("show", ids.length > 0);
    $(".slots", tray).innerHTML = ids.map((id) => `<div class="slot">${TX.ph(TX.byId(id).img)}</div>`).join("") + Array(Math.max(0, 4 - ids.length)).fill('<div class="slot"></div>').join("");
    $(".count", tray).textContent = ids.length;
  }

  /* ------------------------------------------------------------------------ */
  /* Toasts                                                                    */
  /* ------------------------------------------------------------------------ */
  TX.toast = (msg, icon = "check-circle") => {
    let wrap = $(".toasts");
    if (!wrap) { wrap = document.createElement("div"); wrap.className = "toasts"; document.body.appendChild(wrap); }
    const t = document.createElement("div"); t.className = "toast";
    t.innerHTML = ic(icon); const s = document.createElement("span"); s.textContent = msg; t.appendChild(s);
    wrap.appendChild(t); setTimeout(() => t.remove(), 2800);
  };

  /* ------------------------------------------------------------------------ */
  /* Navigation maps                                                           */
  /* ------------------------------------------------------------------------ */
  TX.screens = {
    Storefront: [
      ["store-home.html", "Home"], ["store-listing.html", "Category & search results"], ["store-product.html", "Product detail"],
      ["store-refurbished.html", "Certified refurbished"], ["store-compare.html", "Compare products"], ["store-cart.html", "Cart"],
      ["store-checkout.html", "Checkout"], ["store-order.html", "Order confirmation & tracking"], ["store-account.html", "My account"],
      ["store-returns.html", "Return / warranty request"], ["store-dealer.html", "Dealer zone (B2B)"], ["store-login.html", "Sign in · register · apply"],
      ["store-help.html", "Help centre & policies"],
    ],
    "ERP workspace": [
      ["erp-dashboard.html", "Owner control centre"], ["erp-orders.html", "Orders"], ["erp-fulfilment.html", "Pick · pack · dispatch"],
      ["erp-returns.html", "Returns, RMA & warranty"], ["erp-support.html", "Support & WhatsApp inbox"], ["erp-catalog.html", "Catalog & imports"],
      ["erp-pricing.html", "Pricing & dealer tiers"], ["erp-inventory.html", "Inventory & serials"], ["erp-purchasing.html", "Purchasing & receiving"],
      ["erp-customers.html", "Customers & dealers"], ["erp-vendors.html", "Vendors & submissions"], ["erp-finance.html", "Payments & reconciliation"],
      ["erp-reports.html", "Reports"], ["erp-automation.html", "Automation & exceptions"], ["erp-admin.html", "Settings, roles & audit"],
    ],
    "Vendor portal": [
      ["vendor-dashboard.html", "Vendor dashboard"], ["vendor-products.html", "Products & submissions"],
      ["vendor-availability.html", "Availability, POs & returns"], ["vendor-account.html", "Business profile & statements"],
    ],
  };
  const ERP_NAV = [
    ["Overview", [["dashboard", "erp-dashboard.html", "Control centre", "dashboard"]]],
    ["Sell & serve", [
      ["orders", "erp-orders.html", "Orders", "receipt", "18"],
      ["fulfilment", "erp-fulfilment.html", "Pick · pack · dispatch", "truck", "9"],
      ["returns", "erp-returns.html", "Returns & warranty", "undo", "6"],
      ["support", "erp-support.html", "Support inbox", "headset", "4", true],
    ]],
    ["Catalog", [
      ["catalog", "erp-catalog.html", "Products", "tag"],
      ["pricing", "erp-pricing.html", "Pricing & tiers", "percent"],
    ]],
    ["Stock", [
      ["inventory", "erp-inventory.html", "Inventory & serials", "warehouse"],
      ["purchasing", "erp-purchasing.html", "Purchasing & receiving", "clipboard"],
    ]],
    ["Partners", [
      ["customers", "erp-customers.html", "Customers & dealers", "users", "3"],
      ["vendors", "erp-vendors.html", "Vendors", "building", "5"],
    ]],
    ["Finance & insight", [
      ["finance", "erp-finance.html", "Payments & reconciliation", "wallet"],
      ["reports", "erp-reports.html", "Reports", "chart"],
      ["automation", "erp-automation.html", "Automation", "zap"],
    ]],
    ["Administration", [["admin", "erp-admin.html", "Settings & access", "settings"]]],
  ];
  const VENDOR_NAV = [
    ["Workspace", [
      ["dashboard", "vendor-dashboard.html", "Dashboard", "dashboard"],
      ["products", "vendor-products.html", "Products & submissions", "tag", "3"],
      ["availability", "vendor-availability.html", "Availability & orders", "package", "2"],
      ["account", "vendor-account.html", "Profile & statements", "building"],
    ]],
  ];

  /* ------------------------------------------------------------------------ */
  /* Prototype toolbar                                                         */
  /* ------------------------------------------------------------------------ */
  function buildProtobar(app) {
    const page = location.pathname.split("/").pop() || "index.html";
    const menu = Object.entries(TX.screens).map(([grp, items]) =>
      `<div class="dd-label">${grp}</div>` + items.map(([href, label]) => `<a href="${href}" ${href === page ? 'style="background:var(--brand-50);font-weight:650"' : ""}>${label}</a>`).join("")
    ).join("<hr>");
    const bar = document.createElement("div");
    bar.className = "protobar";
    // Narrow screens: everything after the brand collapses into a panel opened by "Prototype menu"
    bar.innerHTML = `<div class="pb-inner">
      <span class="pb-tag"><a href="index.html" style="color:#fff;display:inline-flex;gap:8px;align-items:center">${TX.logoMark().replace("logo-mark", "logo-mark").replace('class="logo-mark"', 'class="logo-mark" style="width:22px;height:22px;border-radius:6px"')} Tradex prototype</a><span class="badge">v0.1 · for review</span></span>
      <button class="pb-btn pb-more" type="button" aria-expanded="false" aria-controls="pb-rest">${ic("sliders", "ic-sm")} Prototype menu</button>
      <div class="pb-rest" id="pb-rest">
      <span class="pb-sep"></span>
      <div class="seg pb-apps">
        <a href="index.html" class="${app === "hub" ? "active" : ""}">Overview</a>
        <a href="store-home.html" class="${app === "store" ? "active" : ""}">Storefront</a>
        <a href="erp-dashboard.html" class="${app === "erp" ? "active" : ""}">ERP workspace</a>
        <a href="vendor-dashboard.html" class="${app === "vendor" ? "active" : ""}">Vendor portal</a>
      </div>
      <div class="dd"><button class="pb-btn" data-dd-toggle>${ic("layers", "ic-sm")} All screens ${ic("chevron-down", "ic-sm")}</button><div class="dd-menu left">${menu}</div></div>
      ${app === "store" ? `<span class="pb-sep"></span><div class="pb-view"><span style="color:#7d89a3">View as</span>
      <div class="seg"><button data-view="guest">Guest</button><button data-view="consumer">Consumer</button><button data-view="dealer">Approved dealer</button></div></div>` : ""}
      <div class="ml-auto row gap-8 pb-tools">
        <button class="pb-btn" id="pb-annot" title="Show the phase and requirement ID for each feature">${ic("flag", "ic-sm")} Phase notes</button>
        <button class="pb-btn" id="pb-hide" title="Hide the prototype toolbar" aria-label="Hide the prototype toolbar">${ic("eye-off", "ic-sm")}</button>
      </div>
      </div>
    </div>`;
    document.body.prepend(bar);
    const more = $(".pb-more", bar);
    more.onclick = () => { const open = !bar.classList.contains("pb-open"); bar.classList.toggle("pb-open", open); more.setAttribute("aria-expanded", open); };
    const mini = document.createElement("button");
    mini.className = "pb-btn protobar-mini"; mini.style.cssText = "background:#0b1220;color:#fff;border:0;box-shadow:var(--sh-3)";
    mini.innerHTML = `${ic("eye", "ic-sm")} Show prototype bar`;
    document.body.appendChild(mini);
    const setHidden = (h) => { document.documentElement.classList.toggle("proto-hidden", h); document.body.classList.toggle("proto-hidden", h); store.set("pbhidden", h); };
    $("#pb-hide").onclick = () => setHidden(true);
    mini.onclick = () => setHidden(false);
    setHidden(store.get("pbhidden", false));
    const setAnnot = (on) => { document.body.classList.toggle("annot-on", on); $("#pb-annot").classList.toggle("on", on); store.set("annot", on); };
    $("#pb-annot").onclick = () => setAnnot(!document.body.classList.contains("annot-on"));
    setAnnot(store.get("annot", false));
  }

  /* ------------------------------------------------------------------------ */
  /* Storefront shell                                                          */
  /* ------------------------------------------------------------------------ */
  function updateAccountLabel() {
    const el = $("#s-account"); if (!el) return;
    const v = TX.view;
    const line1 = v === "guest" ? "Hello, sign in" : v === "dealer" ? `Hello, ${TX.people.dealer.first}` : `Hello, ${TX.people.consumer.first}`;
    const line2 = v === "dealer" ? "Business account" : "Account & lists";
    el.innerHTML = `${ic("user")}<span><small>${line1}</small><b>${line2}</b></span>`;
    el.href = v === "guest" ? "store-login.html" : v === "dealer" ? "store-dealer.html" : "store-account.html";
    el.setAttribute("aria-label", `${line1} · ${line2}`);
    const d = $("#s-deliver-to");
    if (d) d.innerHTML = v === "dealer" ? "Deliver to Metro Computers<b>Mysuru 570001</b>" : v === "guest" ? "Deliver to<b>Enter PIN code</b>" : "Deliver to Priya<b>Bengaluru 560034</b>";
    // Mobile: slim delivery row, drawer greeting and bottom-bar account tab
    const md = $("#s-mdeliver-to");
    if (md) md.innerHTML = v === "dealer" ? "Deliver to Metro Computers · <b>Mysuru 570001</b>" : v === "guest" ? "Deliver to · <b>Enter PIN code</b>" : "Deliver to Priya · <b>Bengaluru 560034</b>";
    const du = $("#sd-user");
    if (du) { du.href = el.href; du.innerHTML = `<span class="sd-av">${ic("user")}</span><span><b>${line1}</b><small>${v === "guest" ? "Sign in or create an account" : line2}</small></span>`; }
    const ta = $("#s-tab-account");
    if (ta) { ta.href = el.href; $("span:last-child", ta).textContent = v === "guest" ? "Sign in" : "Account"; }
  }
  // Sub-category links shared by the desktop mega menu and the mobile menu drawer: [category id, heading, links]
  const SUBS = [
    ["laptops", "Laptops", [["store-listing.html?cat=laptops", "Business laptops"], ["store-listing.html?cat=laptops", "Gaming laptops"], ["store-listing.html?cat=laptops", "Creator & OLED"], ["store-listing.html?cat=laptops", "MacBook"], ["store-refurbished.html", "Refurbished laptops"], ["store-listing.html?cat=laptops", "Under ₹40,000"]]],
    ["components", "PC components", [["store-listing.html?cat=components", "Graphics cards"], ["store-listing.html?cat=components", "Processors"], ["store-listing.html?cat=components", "Motherboards"], ["store-listing.html?cat=storage", "RAM"], ["store-listing.html?cat=storage", "SSD & HDD"], ["store-listing.html?cat=components", "Cooling"]]],
    ["cameras", "Imaging", [["store-listing.html?cat=cameras", "Mirrorless cameras"], ["store-listing.html?cat=cameras", "DSLR cameras"], ["store-listing.html?cat=lenses", "Lenses"], ["store-listing.html?cat=cameras", "Compact cameras"], ["store-listing.html?cat=cameras", "Used & refurbished"]]],
  ];
  function buildStoreShell(page) {
    const main = $("main"); main.classList.add("store-main");
    const cats = [
      ["laptops", "Laptops"], ["desktops", "Desktops"], ["monitors", "Monitors"], ["components", "Components"], ["storage", "Storage"],
      ["cameras", "Cameras"], ["accessories", "Accessories"], ["audio", "Audio"], ["networking", "Networking"], ["printers", "Printers"],
    ];
    const header = document.createElement("div");
    header.innerHTML = `
    <div class="s-topstrip"><div class="container">
      <div class="row">${ic("truck")} Free delivery on orders above ₹999 · Same-day dispatch before 2 PM</div>
      <div class="row">
        <a href="store-dealer.html" class="hide-dealer">${ic("briefcase")} Dealer / business pricing</a>
        <a href="store-login.html#vendor">Sell with Tradex</a>
        <a href="store-order.html">${ic("package")} Track order</a>
        <a href="store-help.html">${ic("help")} Help</a>
        <a href="#" data-wa>${ic("whatsapp")} +91 80 4000 1234</a>
      </div></div></div>
    <header class="s-header"><div class="container">
      <button class="s-burger" type="button" data-sdrawer aria-controls="s-drawer" aria-expanded="false" aria-label="Open menu">${ic("menu", "ic-lg")}</button>
      ${TX.logo()}
      <div class="s-deliver" data-open="m-pin">${ic("pin")}<span id="s-deliver-to">Deliver to Priya<b>Bengaluru 560034</b></span></div>
      <form class="s-search" onsubmit="event.preventDefault();location.href='store-listing.html?q='+encodeURIComponent(this.q.value)" data-anno="1A · R01 Search-first · exact model/SKU + synonyms">
        <select aria-label="Search in"><option>All</option>${TX.categories.map((c) => `<option>${c.name}</option>`).join("")}</select>
        <input name="q" placeholder="Search laptops, SSDs, model numbers, e.g. “T14 Gen 2” or “1TB NVMe”" autocomplete="off">
        <button aria-label="Search">${ic("search", "ic-lg")}</button>
        <div class="s-suggest">
          <div class="upper muted" style="padding:6px 10px">Suggestions</div>
          <a href="store-listing.html?q=thinkpad">${ic("search")} <span><span class="hl">thinkpad</span> t14 gen 2 refurbished</span></a>
          <a href="store-listing.html?q=ssd">${ic("search")} <span><span class="hl">1tb</span> nvme ssd <span class="muted">in Storage</span></span></a>
          <a href="store-product.html?id=lap-03">${ic("laptop")} <span>Apple MacBook Air M2 <span class="muted">· Open box · ₹84,990</span></span></a>
          <div class="upper muted" style="padding:10px 10px 6px">Popular</div>
          <div class="row wrap gap-6" style="padding:0 10px 8px"><span class="chip">RTX 4060</span><span class="chip">Refurbished laptops</span><span class="chip">USB-C hub</span><span class="chip">Canon lens</span></div>
        </div>
      </form>
      <div class="s-actions">
        <a class="s-act s-act-account" id="s-account" href="store-account.html"></a>
        <a class="s-act s-act-orders only-signed" href="store-account.html#orders">${ic("package")}<span><small>Returns</small><b>& Orders</b></span></a>
        <a class="s-act s-act-wish" href="store-account.html#wishlist" data-tip="Wishlist" aria-label="Wishlist">${ic("heart")}</a>
        <a class="s-act s-act-cart" href="store-cart.html" aria-label="Cart">${ic("cart")}<span class="count" data-cart-count>0</span><span><small>&nbsp;</small><b>Cart</b></span></a>
      </div>
    </div></header>
    <div class="s-mdeliver"><div class="container"><button type="button" data-open="m-pin">${ic("pin", "ic-sm")}<span id="s-mdeliver-to">Deliver to Priya · <b>Bengaluru 560034</b></span>${ic("chevron-down", "ic-sm")}</button></div></div>
    <nav class="s-catbar" aria-label="Shop by category"><div class="container">
      <button type="button" class="all" data-mega aria-expanded="false" aria-controls="s-mega">${ic("menu")} All categories</button>
      ${cats.map(([id, n], i) => `<a href="store-listing.html?cat=${id}" data-p="${i}" class="${(TX.param("cat") || (page === "listing" && !TX.param("q") && !TX.param("brand") && !TX.param("deals") ? "laptops" : "")) === id ? "active" : ""}">${n}</a>`).join("")}
      <a href="store-refurbished.html" class="refurb ${page === "refurbished" ? "active" : ""}">${ic("award")} Refurbished</a>
      <a href="store-listing.html?deals=1" class="deal">${ic("flame")} Deals</a>
      <a href="store-dealer.html" class="dz ml-auto ${page === "dealer" ? "active" : ""}" style="color:#07695b">${ic("briefcase")} Dealer zone</a>
    </div>
    <div class="s-mega" id="s-mega"><div class="container">
      <div class="m-cats col gap-4">${TX.categories.map((c) => `<a href="store-listing.html?cat=${c.id}">${ic(c.icon, "ic-sm")} ${c.name} ${ic("chevron-right", "ic-sm")}</a>`).join("")}</div>
      <div class="m-cols">${SUBS.map(([, title, links]) => `<div><h5>${title}</h5>${links.map(([href, n]) => `<a href="${href}">${n}</a>`).join("")}</div>`).join("")}</div>
      <a class="promo photo" href="store-listing.html?cat=desktops" style="min-height:220px;text-decoration:none"><div class="p-bg">${TX.ph("pc-case", "round-0")}</div><div><span class="badge b-accent">Build your PC</span><h3 class="mt-8" style="color:#fff">Custom builds, tested & warrantied</h3><p>Pick parts or start from a Tradex build.</p></div><span class="btn btn-sm btn-accent" style="align-self:flex-start">Explore builds</span></a>
    </div></div></nav>`;
    document.body.insertBefore(header, main);

    const footer = document.createElement("footer");
    footer.className = "s-footer";
    footer.innerHTML = `<div class="container">
      <div class="f-top">
        <div>${TX.logo()}<p class="mt-12" style="max-width:300px">Computers, parts, cameras and electronics — new, open-box and certified refurbished — with honest condition grading and real warranty support.</p>
          <div class="news"><input class="input" placeholder="Email for deals & restocks"><button class="btn btn-accent">Subscribe</button></div>
          <div class="row mt-12 gap-8 small">${ic("whatsapp")} WhatsApp +91 80 4000 1234 · ${ic("mail")} care@tradex.example</div></div>
        <div><h5>Shop</h5><a href="store-listing.html?cat=laptops">Laptops</a><a href="store-listing.html?cat=desktops">Desktops & builds</a><a href="store-listing.html?cat=components">Components</a><a href="store-listing.html?cat=cameras">Cameras & lenses</a><a href="store-refurbished.html">Certified refurbished</a><a href="store-listing.html?deals=1">Deals</a></div>
        <div><h5>Business</h5><a href="store-dealer.html">Dealer pricing</a><a href="store-dealer.html#bulk">Bulk / quick order</a><a href="store-login.html#dealer">Apply as dealer</a><a href="store-login.html#vendor">Sell with Tradex</a><a href="vendor-dashboard.html">Vendor portal login</a></div>
        <div><h5>Help</h5><a href="store-order.html">Track your order</a><a href="store-returns.html">Returns & replacements</a><a href="store-help.html#warranty">Warranty & RMA</a><a href="store-help.html#grades">Condition grades</a><a href="store-help.html#shipping">Shipping & delivery</a><a href="store-help.html">Contact us</a></div>
        <div><h5>Visit a store</h5><a href="store-help.html#stores">SP Road, Bengaluru</a><a href="store-help.html#stores">Koramangala, Bengaluru</a><a href="store-help.html#stores">Mysuru</a><a href="store-help.html#stores">Store hours & directions</a></div>
      </div>
      <div class="f-bottom"><span>© 2026 Tradex. Prototype for review — sample data and product photos (Unsplash licence, see <a href="credits.html" style="display:inline;color:#c9d2e3">credits</a>).</span>
        <div class="row"><a href="store-help.html#terms" style="display:inline">Terms</a> · <a href="store-help.html#privacy" style="display:inline">Privacy</a> · <a href="store-help.html#grievance" style="display:inline">Grievance officer</a>
        <div class="pay-row"><span>UPI</span><span>VISA</span><span>MASTERCARD</span><span>RUPAY</span><span>NETBANKING</span><span>EMI</span></div></div></div>
    </div>`;
    main.after(footer);

    // Help / chat widget (deterministic guided flow — no AI in Phase 1)
    const fab = document.createElement("div");
    fab.className = "helpfab";
    fab.innerHTML = `
      <div class="chatbox" data-anno="1A/1B · R11 Guided help · human & WhatsApp handoff (no LLM)">
        <div class="cb-head"><div class="avatar" style="background:#fff;color:var(--brand)">${ic("headset", "ic-sm")}</div><div class="grow"><b>Tradex Help</b><div class="small" style="opacity:.8">Typically replies in 5 min · 9 AM–9 PM</div></div><button class="btn btn-ghost btn-icon btn-sm" style="color:#fff" data-chat-close aria-label="Close help">${ic("x")}</button></div>
        <div class="cb-body" id="cb-body"></div>
        <div class="cb-foot"><input class="input input-sm" placeholder="Type your question…" id="cb-input" aria-label="Type your question"><button class="btn btn-primary btn-sm btn-icon" id="cb-send" aria-label="Send">${ic("send", "ic-sm")}</button></div>
      </div>
      <div class="row gap-8"><button class="fab-wa" data-wa data-tip="Chat on WhatsApp" aria-label="Chat on WhatsApp">${ic("whatsapp", "ic-lg")}</button><button class="fab" data-chat-open aria-label="Help">${ic("chat")} <span>Help</span></button></div>`;
    document.body.appendChild(fab);
    initChat(fab);

    // Compare tray
    const tray = document.createElement("div");
    tray.className = "compare-tray"; tray.id = "compare-tray";
    tray.innerHTML = `<div><b>Compare</b><div class="small" style="color:#9aa6bf"><span class="count">0</span> of 4 selected</div></div><div class="slots"></div><button class="btn btn-ghost btn-sm" style="color:#c9d2e3" data-compare-clear>Clear</button><a class="btn btn-accent btn-sm" href="store-compare.html">Compare now ${ic("arrow-right", "ic-sm")}</a>`;
    document.body.appendChild(tray);

    // PIN modal
    const m = document.createElement("div");
    m.className = "modal"; m.id = "m-pin";
    m.innerHTML = `<div class="modal-card"><div class="modal-head"><h3>Choose your delivery location</h3><button class="btn btn-ghost btn-icon btn-sm" data-close>${ic("x")}</button></div>
      <div class="modal-body col gap-16"><p class="subtle">Delivery dates, serviceability and COD eligibility depend on your PIN code. Prices are the same everywhere unless a location price list applies.</p>
      <div class="row"><input class="input" value="560034" style="max-width:200px"><button class="btn btn-primary" data-close data-toast="Delivery location updated · 560034 is serviceable">Apply</button></div>
      <div class="panel small">${ic("pin", "ic-sm")} Saved addresses: <b>Home — Koramangala 560034</b> · Office — Whitefield 560066</div></div></div>`;
    document.body.appendChild(m);

    // Mobile / tablet menu drawer (opened by the header menu button, "All categories" and the bottom bar)
    const subsOf = Object.fromEntries(SUBS.map(([id, , links]) => [id, links]));
    const dr = document.createElement("div");
    dr.className = "s-drawer"; dr.id = "s-drawer"; dr.hidden = true;
    dr.innerHTML = `<div class="sd-backdrop" data-sdrawer-close></div>
      <div class="sd-panel" role="dialog" aria-modal="true" aria-labelledby="sd-title">
        <div class="sd-head">
          <h2 class="sr-only" id="sd-title">Menu</h2>
          <a class="sd-user" id="sd-user" href="store-account.html"></a>
          <button class="sd-close" type="button" data-sdrawer-close aria-label="Close menu">${ic("x", "ic-lg")}</button>
        </div>
        <div class="sd-body">
          <button type="button" class="sd-pin" data-open="m-pin">${ic("pin")}<span id="sd-pin-to">Change delivery location</span>${ic("chevron-right", "ic-sm")}</button>
          <div class="sd-quick">
            <a href="store-account.html#orders" class="hide-guest">${ic("package")}<span>Orders</span></a>
            <a href="store-login.html" class="only-guest">${ic("user")}<span>Sign in</span></a>
            <a href="store-account.html#wishlist">${ic("heart")}<span>Wishlist</span></a>
            <a href="store-order.html">${ic("truck")}<span>Track order</span></a>
            <a href="store-cart.html">${ic("cart")}<span>Cart <b data-cart-count>0</b></span></a>
          </div>
          <nav aria-label="Shop by category">
            <h3 class="sd-sec">Shop by category</h3>
            ${TX.categories.map((c) => subsOf[c.id]
              ? `<details class="sd-acc"><summary>${ic(c.icon)}<span>${c.name}</span>${ic("chevron-down", "ic-sm sd-chev")}</summary>
                  <div class="sd-sub"><a href="store-listing.html?cat=${c.id}"><b>All ${c.name.toLowerCase()}</b></a>${subsOf[c.id].map(([href, n]) => `<a href="${href}">${n}</a>`).join("")}</div></details>`
              : `<a class="sd-link" href="store-listing.html?cat=${c.id}">${ic(c.icon)}<span>${c.name}</span>${ic("chevron-right", "ic-sm")}</a>`).join("")}
            <h3 class="sd-sec">Featured</h3>
            <a class="sd-link" href="store-refurbished.html">${ic("award")}<span>Certified refurbished</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="store-listing.html?deals=1">${ic("flame")}<span>Deals</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="store-compare.html">${ic("compare")}<span>Compare products</span>${ic("chevron-right", "ic-sm")}</a>
          </nav>
          <nav aria-label="Business">
            <h3 class="sd-sec">For business</h3>
            <a class="sd-link" href="store-dealer.html">${ic("briefcase")}<span>Dealer zone</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link hide-dealer" href="store-login.html#dealer">${ic("building")}<span>Apply for dealer pricing</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="store-login.html#vendor">${ic("store")}<span>Sell with Tradex</span>${ic("chevron-right", "ic-sm")}</a>
          </nav>
          <nav aria-label="Help and services">
            <h3 class="sd-sec">Help & services</h3>
            <a class="sd-link" href="store-returns.html">${ic("undo")}<span>Returns & replacements</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="store-help.html#warranty">${ic("shield")}<span>Warranty & RMA</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="store-help.html">${ic("help")}<span>Help centre</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="store-help.html#stores">${ic("pin")}<span>Visit a store</span>${ic("chevron-right", "ic-sm")}</a>
            <a class="sd-link" href="#" data-wa>${ic("whatsapp")}<span>WhatsApp +91 80 4000 1234</span>${ic("chevron-right", "ic-sm")}</a>
          </nav>
          <a class="sd-link sd-out hide-guest" href="store-home.html?as=guest">${ic("logout")}<span>Sign out</span></a>
        </div>
      </div>`;
    document.body.appendChild(dr);
    initStoreDrawer(dr);

    // Mobile bottom bar (hidden on checkout — a focused flow — and on product pages, which show a buy bar instead)
    const tabs = document.createElement("nav");
    tabs.className = "s-tabbar"; tabs.setAttribute("aria-label", "Quick navigation");
    const cur = (on) => (on ? 'class="on" aria-current="page"' : "");
    tabs.innerHTML = `
      <a href="store-home.html" ${cur(page === "home")}>${ic("home")}<span>Home</span></a>
      <button type="button" data-sdrawer aria-controls="s-drawer" aria-expanded="false">${ic("grid")}<span>Categories</span></button>
      <a href="store-listing.html?deals=1" class="hide-dealer ${page === "listing" && TX.param("deals") ? "on" : ""}">${ic("flame")}<span>Deals</span></a>
      <a href="store-dealer.html" class="only-dealer ${page === "dealer" ? "on" : ""}">${ic("briefcase")}<span>Dealer</span></a>
      <a href="store-account.html" id="s-tab-account" ${cur(page === "account" || page === "login")}>${ic("user")}<span>Account</span></a>
      <a href="store-cart.html" class="s-tab-cart" ${cur(page === "cart")}>${ic("cart")}<span class="count" data-cart-count>0</span><span>Cart</span></a>`;
    document.body.appendChild(tabs);

    updateAccountLabel(); updateCartCount(); updateCompareTray();
  }

  function initStoreDrawer(dr) {
    const panel = $(".sd-panel", dr);
    let lastFocus = null, closeTimer = null;
    const setExpanded = (v) => $$("[data-sdrawer]").forEach((b) => b.setAttribute("aria-expanded", v));
    const focusables = () => $$('a[href], button:not([disabled]), summary, input, [tabindex]:not([tabindex="-1"])', panel).filter((el) => el.offsetParent !== null);
    const open = () => {
      clearTimeout(closeTimer);
      lastFocus = document.activeElement;
      const pin = $("#sd-pin-to"), md = $("#s-mdeliver-to");
      if (pin && md) pin.innerHTML = md.innerHTML;
      dr.hidden = false;
      requestAnimationFrame(() => dr.classList.add("open"));
      document.documentElement.classList.add("s-lock");
      setExpanded("true");
      $(".sd-close", dr).focus();
    };
    const close = (restore = true) => {
      if (dr.hidden) return;
      dr.classList.remove("open");
      document.documentElement.classList.remove("s-lock");
      setExpanded("false");
      closeTimer = setTimeout(() => { dr.hidden = true; }, 220);
      if (restore && lastFocus && document.contains(lastFocus)) lastFocus.focus();
    };
    TX.openMenu = open; TX.closeMenu = close;
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-sdrawer]")) { e.preventDefault(); dr.hidden ? open() : close(); return; }
      if (!dr.contains(e.target)) return;
      if (e.target.closest("[data-sdrawer-close]")) close();
      else if (e.target.closest("[data-open]")) close(false);   // e.g. delivery PIN modal opens on top
    });
    dr.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.stopPropagation(); close(); return; }
      if (e.key !== "Tab") return;
      const f = focusables(); if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Rotating a tablet to a desktop-width layout closes the drawer
    const mq = window.matchMedia("(min-width: 981px)");
    const onMq = () => { if (mq.matches) close(false); };
    mq.addEventListener ? mq.addEventListener("change", onMq) : mq.addListener(onMq);
  }

  function initChat(fab) {
    const body = $("#cb-body", fab);
    const add = (cls, html) => { const d = document.createElement("div"); d.className = "msg " + cls; if (cls === "me") d.textContent = html; else d.innerHTML = html; body.appendChild(d); body.scrollTop = body.scrollHeight; return d; };
    const quick = (opts) => { const q = document.createElement("div"); q.className = "quick"; q.innerHTML = opts.map((o) => `<button data-q="${o}">${o}</button>`).join(""); body.appendChild(q); body.scrollTop = body.scrollHeight; };
    const flows = {
      "Track my order": ["Sure — enter your order number (e.g. TXO-10482) and the phone number used at checkout. For your security, we'll send a one-time code before showing order details.", ["Open order tracking", "Talk to a person"]],
      "Product question": ["I can help with specifications, compatibility and condition grades. For compatibility checks (e.g. RAM for a specific laptop), a product specialist confirms before you buy.", ["Explain condition grades", "Talk to a person"]],
      "Returns & warranty": ["Returns are accepted within 7 days for most items (10 days for refurbished). Warranty claims need your order number and device serial number.", ["Start a return", "Warranty policy"]],
      "Dealer pricing": ["Registered businesses can apply for dealer pricing with quantity tiers. Approval usually takes 1–2 working days after GST verification.", ["Apply as dealer", "Talk to a person"]],
      "Explain condition grades": ["<b>Open box</b>: unused, packaging opened. <b>Grade A</b>: minimal signs of use. <b>Grade B</b>: light visible wear. <b>Used · Good</b>: pre-owned with described wear. Every refurbished unit shows its own inspection report.", ["Browse refurbished", "Talk to a person"]],
      "Talk to a person": ["Connecting you to a support executive… You're #2 in the queue. You can also continue on WhatsApp — your conversation reference is <b>SUP-7731</b>.", ["Continue on WhatsApp"]],
    };
    const links = { "Open order tracking": "store-order.html", "Start a return": "store-returns.html", "Warranty policy": "store-help.html#warranty", "Apply as dealer": "store-login.html#dealer", "Browse refurbished": "store-refurbished.html" };
    const start = () => { body.innerHTML = ""; add("sys", "Today"); add("bot", "Hi! 👋 I'm the Tradex help assistant. What can I help you with?"); quick(["Track my order", "Product question", "Returns & warranty", "Dealer pricing", "Talk to a person"]); };
    start();
    fab.addEventListener("click", (e) => {
      if (e.target.closest("[data-chat-open]")) fab.classList.toggle("open");
      if (e.target.closest("[data-chat-close]")) fab.classList.remove("open");
      const q = e.target.closest("[data-q]");
      if (q) {
        const k = q.dataset.q; q.parentElement.remove(); add("me", k);
        if (links[k]) { location.href = links[k]; return; }
        if (k === "Continue on WhatsApp") { TX.toast("Opening WhatsApp with reference SUP-7731…", "whatsapp"); return; }
        const f = flows[k]; setTimeout(() => { add("bot", f[0]); quick(f[1]); }, 350);
      }
    });
    const send = () => { const i = $("#cb-input", fab); if (!i.value.trim()) return; add("me", i.value); i.value = ""; setTimeout(() => { add("bot", "Thanks! I've passed this to our team. A support executive will reply here shortly."); quick(["Talk to a person", "Track my order"]); }, 400); };
    $("#cb-send", fab).onclick = send;
    $("#cb-input", fab).addEventListener("keydown", (e) => { if (e.key === "Enter") send(); });
  }

  /* ------------------------------------------------------------------------ */
  /* Workspace shell (ERP + Vendor)                                            */
  /* ------------------------------------------------------------------------ */
  function buildWorkspaceShell(app, page) {
    const main = $("main"); main.classList.add("ws-main");
    const nav = app === "erp" ? ERP_NAV : VENDOR_NAV;
    const navHTML = nav.map(([grp, items]) => `<div class="grp">${grp}</div>` + items.map(([id, href, label, icon, n, hot]) =>
      `<a href="${href}" class="${id === page ? "active" : ""}">${ic(icon)} <span>${label}</span>${n ? `<span class="n ${hot ? "hot" : ""}">${n}</span>` : ""}</a>`).join("")).join("");
    const isV = app === "vendor";
    const who = isV ? { name: "Suresh Babu", role: "RenewTech Refurbishers", init: "SB", color: "#0e9f8a" } : TX.staff[0];
    const shell = document.createElement("div");
    shell.className = "ws";
    shell.innerHTML = `
      <aside class="ws-side">
        <div class="ws-brand">${TX.logoMark()}<div><span class="logo-word">trade<b>x</b></span><div class="logo-sub">${isV ? "Vendor portal" : "ERP workspace"}</div></div></div>
        <div class="ws-org">${isV ? `<div class="avatar sm sq" style="background:#0e9f8a">RT</div><div class="grow"><b>RenewTech Refurbishers</b><small>Vendor V-022 · Approved supplier</small></div>` : `<div class="avatar sm sq" style="background:#2e5bff">TX</div><div class="grow"><b>Tradex Electronics Pvt Ltd</b><small>All locations · FY 2026-27</small></div>`}${ic("chevron-down", "ic-sm")}</div>
        <nav class="ws-nav">${navHTML}</nav>
        ${isV ? "" : `<div style="margin:0 12px 12px;padding:12px;border-radius:10px;background:#121b2f;border:1px solid #1f2a44;font-size:12px;color:#aab4c8">
          <div class="row-between"><b style="color:#fff">System health</b><span class="status s-ok" style="color:#5ee29a">All good</span></div>
          <div class="mt-8">Stock sync lag <b style="color:#fff">14 s</b> · Jobs queue <b style="color:#fff">3</b></div>
          <div>Last backup <b style="color:#fff">02:00 today</b> · restore tested 21 Sep</div></div>`}
        <div class="ws-foot"><div class="avatar" style="background:${who.color}">${who.init}</div><div class="grow"><b>${who.name}</b><small>${who.role}</small></div><a href="store-home.html" data-tip="Open storefront" style="color:#7d89a3">${ic("external", "ic-sm")}</a></div>
      </aside>
      <div class="ws-body">
        <div class="ws-top">
          <div class="ws-search">${ic("search")}<input class="input" placeholder="${isV ? "Search your products, POs, submissions…" : "Search orders, SKUs, serials, customers, POs…"}"><span class="kbd">Ctrl K</span></div>
          ${isV ? "" : `<div class="dd"><button class="btn btn-sm" data-dd-toggle>${ic("pin", "ic-sm")} All locations ${ic("chevron-down", "ic-sm")}</button>
            <div class="dd-menu left"><div class="dd-label">Scope</div><a href="#">${ic("globe", "ic-sm")} All locations</a>${TX.locations.map((l) => `<a href="#">${ic(l.type === "Warehouse" ? "warehouse" : "store", "ic-sm")} ${l.name} <span class="muted small ml-auto">${l.code}</span></a>`).join("")}</div></div>`}
          <div class="ml-auto row gap-8">
            ${isV ? `<a class="btn btn-sm" href="vendor-products.html#new" style="--b-bg:#0e9f8a;--b-fg:#fff;--b-bd:#0e9f8a">${ic("plus", "ic-sm")} Submit product</a>` : `<div class="dd"><button class="btn btn-primary btn-sm" data-dd-toggle>${ic("plus", "ic-sm")} New ${ic("chevron-down", "ic-sm")}</button>
              <div class="dd-menu"><a href="erp-orders.html#assisted">${ic("receipt", "ic-sm")} Assisted order</a><a href="erp-purchasing.html#new-po">${ic("clipboard", "ic-sm")} Purchase order</a><a href="erp-purchasing.html#receive">${ic("scan", "ic-sm")} Goods receipt (GRN)</a><a href="erp-inventory.html#transfers">${ic("transfer", "ic-sm")} Stock transfer</a><a href="erp-catalog.html#editor">${ic("tag", "ic-sm")} Product draft</a><a href="erp-catalog.html#import">${ic("upload", "ic-sm")} Bulk import</a></div></div>`}
            <div class="dd"><button class="top-btn" data-dd-toggle aria-label="Notifications">${ic("bell")}<span class="pip"></span></button>
              <div class="dd-menu" style="width:360px"><div class="row-between" style="padding:6px 10px"><b>Notifications</b><a href="#" class="small">Mark all read</a></div><hr>
                ${isV ? `<a href="vendor-products.html">${ic("alert", "ic-sm")} VS-0218 needs changes: warranty provider missing</a><a href="vendor-availability.html">${ic("clock", "ic-sm")} Availability feed goes stale in 6 h</a><a href="vendor-availability.html">${ic("clipboard", "ic-sm")} New PO-2026-0192 awaiting confirmation</a>`
                : `<a href="erp-finance.html">${ic("alert-octagon", "ic-sm")} Payment captured, order not confirmed · TXO-10477</a><a href="erp-inventory.html#counts">${ic("alert", "ic-sm")} Cycle-count variance −2 units · WH-BLR bin A-14</a><a href="erp-vendors.html">${ic("building", "ic-sm")} 3 vendor submissions waiting review</a><a href="erp-automation.html">${ic("zap", "ic-sm")} Courier sync failed 3× · auto-retry paused</a>`}
              </div></div>
            <a class="top-btn" href="${isV ? "store-help.html" : "erp-admin.html"}" aria-label="Help">${ic("help")}</a>
            <div class="dd"><div class="ws-user" data-dd-toggle><div class="avatar" style="background:${who.color}">${who.init}</div><div><b>${who.name}</b><small>${who.role}</small></div>${ic("chevron-down", "ic-sm")}</div>
              <div class="dd-menu"><a href="#">${ic("user", "ic-sm")} My profile</a><a href="#">${ic("key", "ic-sm")} Security & MFA</a>${isV ? "" : `<a href="erp-admin.html#delegation">${ic("users", "ic-sm")} Delegation while away</a>`}<hr><a href="store-home.html">${ic("logout", "ic-sm")} Sign out</a></div></div>
          </div>
        </div>
      </div>`;
    document.body.insertBefore(shell, main);
    $(".ws-body", shell).appendChild(main);
  }

  /* ------------------------------------------------------------------------ */
  /* Event delegation                                                          */
  /* ------------------------------------------------------------------------ */
  function activateTab(tab) {
    const set = tab.closest("[data-tabset]") || document;
    const bar = tab.closest(".tabs");
    $$(".tab", bar).forEach((t) => t.classList.toggle("active", t === tab));
    // Swipeable tab rows (narrow screens): bring the active tab into view horizontally
    if (bar && bar.scrollWidth > bar.clientWidth + 1) bar.scrollLeft = Math.max(0, tab.offsetLeft - bar.offsetLeft - (bar.clientWidth - tab.offsetWidth) / 2);
    $$("[data-panel]", set).filter((p) => (p.closest("[data-tabset]") || document) === set)
      .forEach((p) => p.classList.toggle("active", p.dataset.panel === tab.dataset.tab));
  }
  TX.activateTab = (id) => { const t = $(`.tab[data-tab="${id}"]`); if (t) activateTab(t); };

  // Off-canvas panels on small screens (listing filters, account menu…). [data-sheet-open="<id>"] opens #id,
  // [data-sheet-close] inside it closes. The page's CSS decides how an open `.sheet-open` panel looks.
  let sheet = null;
  TX.openSheet = (id, opener) => {
    const el = document.getElementById(id); if (!el) return;
    if (sheet) TX.closeSheet(false);
    let bd = $(".sheet-backdrop");
    if (!bd) { bd = document.createElement("div"); bd.className = "sheet-backdrop"; document.body.appendChild(bd); bd.addEventListener("click", () => TX.closeSheet()); }
    sheet = { el, opener: opener || document.activeElement };
    el.classList.add("sheet-open"); bd.classList.add("show");
    el.setAttribute("role", "dialog"); el.setAttribute("aria-modal", "true");
    document.documentElement.classList.add("s-lock");
    $$(`[data-sheet-open="${id}"]`).forEach((b) => b.setAttribute("aria-expanded", "true"));
    // focus once the slide-in has made the panel visible
    setTimeout(() => { const f = $("[data-sheet-close]", el); if (f) f.focus(); else { el.tabIndex = -1; el.focus(); } }, 60);
  };
  TX.closeSheet = (restore = true) => {
    if (!sheet) return;
    const { el, opener } = sheet; sheet = null;
    el.classList.remove("sheet-open"); const bd = $(".sheet-backdrop"); if (bd) bd.classList.remove("show");
    el.removeAttribute("role"); el.removeAttribute("aria-modal");
    document.documentElement.classList.remove("s-lock");
    $$(`[data-sheet-open="${el.id}"]`).forEach((b) => b.setAttribute("aria-expanded", "false"));
    if (restore && opener && document.contains(opener)) opener.focus();
  };
  const sheetMq = window.matchMedia("(min-width: 981px)");
  const onSheetMq = () => { if (sheetMq.matches) TX.closeSheet(false); };
  sheetMq.addEventListener ? sheetMq.addEventListener("change", onSheetMq) : sheetMq.addListener(onSheetMq);
  TX.open = (id) => { const m = document.getElementById(id); if (m) m.classList.add("open"); };
  TX.close = (el) => { const m = el.closest(".modal,.drawer"); if (m) m.classList.remove("open"); };

  function bindEvents() {
    document.addEventListener("click", (e) => {
      const t = e.target;
      let el;
      if ((el = t.closest(".tab[data-tab]"))) {
        activateTab(el);
        // Page-level tabs update the URL so a view can be shared/reloaded (not tabs inside drawers/modals)
        if (!el.closest(".modal,.drawer") && history.replaceState) history.replaceState(null, "", "#" + el.dataset.tab);
      }
      if ((el = t.closest("[data-open]"))) { e.preventDefault(); TX.open(el.dataset.open); }
      if ((el = t.closest("[data-close]"))) { TX.close(el); }
      if (t.classList.contains("modal") || t.classList.contains("drawer")) t.classList.remove("open");
      const toggle = t.closest("[data-dd-toggle]"), inMenu = t.closest(".dd-menu");
      $$(".dd.open").forEach((d) => {
        if (toggle && d === toggle.closest(".dd")) return;          // handled below
        if (inMenu && d.contains(inMenu) && !t.closest("a,button,.dd-item")) return; // clicks on menu chrome keep it open
        d.classList.remove("open");
      });
      if (toggle) { e.preventDefault(); toggle.closest(".dd").classList.toggle("open"); }
      if ((el = t.closest(".qty button"))) {
        // Markup: <div class="qty"><button data-step="-1">…</button><input value="1" min="1"><button data-step="1">…</button></div>
        const inp = $("input", el.parentElement);
        inp.value = Math.max(+(inp.min || 0), (+inp.value || 0) + +(el.dataset.step || 1));
        inp.dispatchEvent(new Event("change", { bubbles: true }));
      }
      if ((el = t.closest("[data-fav]"))) {
        e.preventDefault(); const id = el.dataset.fav; let f = store.get("fav", []);
        f = f.includes(id) ? f.filter((x) => x !== id) : [...f, id]; store.set("fav", f);
        el.classList.toggle("on", f.includes(id)); TX.toast(f.includes(id) ? "Saved to wishlist" : "Removed from wishlist", "heart");
      }
      if ((el = t.closest("[data-add]"))) { e.preventDefault(); TX.addToCart(el.dataset.add, +(el.dataset.qty || 1)); }
      if ((el = t.closest("[data-view]"))) { TX.setView(el.dataset.view); }
      if ((el = t.closest(".seg:not(.protobar .seg) > button"))) { $$("button", el.parentElement).forEach((b) => b.classList.toggle("active", b === el)); }
      if ((el = t.closest(".chip[data-toggle]"))) { el.classList.toggle("active"); }
      if ((el = t.closest("[data-chat-open]")) && !el.closest(".helpfab")) { e.preventDefault(); const f = $(".helpfab"); if (f) f.classList.add("open"); }
      if ((el = t.closest("[data-toast]"))) { TX.toast(el.dataset.toast, el.dataset.toastIcon || "check-circle"); }
      if ((el = t.closest("[data-wa]"))) { e.preventDefault(); TX.toast("Opens WhatsApp chat with product/order reference", "whatsapp"); }
      if ((el = t.closest("[data-sheet-open]"))) { e.preventDefault(); TX.openSheet(el.dataset.sheetOpen, el); }
      else if (t.closest("[data-sheet-close]") && sheet) { TX.closeSheet(); }
      if ((el = t.closest("[data-mega]"))) {
        e.preventDefault();
        if (window.matchMedia("(max-width: 980px)").matches && TX.openMenu) TX.openMenu();   // touch layouts use the menu drawer
        else { const open = el.closest(".s-catbar").classList.toggle("mega-open"); el.setAttribute("aria-expanded", open); }
      }
      else if (!t.closest(".s-mega")) closeMega();
      if ((el = t.closest("[data-compare-clear]"))) { store.set("compare", []); $$("[data-compare]").forEach((c) => (c.checked = false)); updateCompareTray(); }
      if ((el = t.closest("tr[data-href]")) && !t.closest("a,button,input,label")) { location.href = el.dataset.href; }
      if ((el = t.closest("tr[data-drawer]")) && !t.closest("a,button,input,label")) { TX.open(el.dataset.drawer); }
    });
    document.addEventListener("change", (e) => {
      const t = e.target;
      if (t.matches("[data-check-all]")) {
        const table = t.closest("table"); $$("tbody input[type=checkbox]", table).forEach((c) => { c.checked = t.checked; c.closest("tr").classList.toggle("selected", t.checked); });
        syncBulk(table);
      } else if (t.matches("table tbody input[type=checkbox]")) { t.closest("tr").classList.toggle("selected", t.checked); syncBulk(t.closest("table")); }
      if (t.matches("[data-compare]")) {
        let c = store.get("compare", []); const id = t.dataset.compare;
        if (t.checked && c.length >= 4) { t.checked = false; TX.toast("You can compare up to 4 products", "info"); return; }
        c = t.checked ? [...new Set([...c, id])] : c.filter((x) => x !== id); store.set("compare", c); updateCompareTray();
      }
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { $$(".modal.open,.drawer.open").forEach((m) => m.classList.remove("open")); $$(".dd.open").forEach((d) => d.classList.remove("open")); closeMega(); TX.closeSheet(); }
      if (e.key === "Tab" && sheet) {   // keep keyboard focus inside an open off-canvas panel
        const f = $$('a[href], button:not([disabled]), input:not([disabled]), select, textarea, summary, [tabindex]:not([tabindex="-1"])', sheet.el).filter((x) => x.offsetParent !== null);
        if (!f.length) return;
        if (!sheet.el.contains(document.activeElement)) { e.preventDefault(); f[0].focus(); return; }
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
  function closeMega() {
    $$(".s-catbar.mega-open").forEach((c) => { c.classList.remove("mega-open"); const b = $("[data-mega]", c); if (b) b.setAttribute("aria-expanded", "false"); });
  }
  function syncBulk(table) {
    const wrap = table.closest(".card") || document; const bar = $(".bulkbar", wrap); if (!bar) return;
    const n = $$("tbody input[type=checkbox]:checked", table).length; bar.classList.toggle("show", n > 0); const c = $(".bulk-count", bar); if (c) c.textContent = n;
  }

  /* ------------------------------------------------------------------------ */
  /* Charts (SVG) — thin marks, hairline grid, legend + direct labels,         */
  /* crosshair tooltip, table-view twin. Palette = validated reference slots.  */
  /* ------------------------------------------------------------------------ */
  const NS = "http://www.w3.org/2000/svg";
  const svgEl = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); if (parent) parent.appendChild(n); return n; };
  const niceMax = (v) => { const p = Math.pow(10, Math.floor(Math.log10(v))); const m = v / p; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p; };
  function tipBox(host) { let t = $(".chart-tip", host); if (!t) { t = document.createElement("div"); t.className = "chart-tip"; host.appendChild(t); } return t; }
  function fillTip(tip, head, rows) {
    tip.innerHTML = ""; const h = document.createElement("div"); h.className = "tt-h"; h.textContent = head; tip.appendChild(h);
    rows.forEach((r) => { const row = document.createElement("div"); row.className = "tt-r"; const k = document.createElement("span"); k.className = "key"; k.style.background = r.color; const b = document.createElement("b"); b.textContent = r.value; const s = document.createElement("span"); s.textContent = r.name; row.append(k, b, s); tip.appendChild(row); });
  }
  function tableTwin(wrap, headers, rows) {
    const d = document.createElement("div"); d.className = "chart-table table-wrap";
    const tbl = document.createElement("table"); tbl.className = "table compact"; const thead = tbl.createTHead().insertRow();
    headers.forEach((h, i) => { const th = document.createElement("th"); th.textContent = h; if (i) th.className = "r"; thead.appendChild(th); });
    const tb = tbl.createTBody(); rows.forEach((r) => { const tr = tb.insertRow(); r.forEach((c, i) => { const td = tr.insertCell(); td.textContent = c; if (i) td.className = "r"; }); });
    d.appendChild(tbl); wrap.appendChild(d);
  }
  TX.charts = {};
  // Charts measure their host; if it is hidden (e.g. inactive tab), render once it becomes visible.
  const whenVisible = (host, render) => {
    if (host.clientWidth > 0 || typeof ResizeObserver === "undefined") return false;
    const ro = new ResizeObserver(() => { if (host.clientWidth > 0) { ro.disconnect(); render(); } });
    ro.observe(host); return true;
  };
  /** Multi-series line chart. cfg: {labels:[], series:[{name,color,values}], format:fn, height} */
  TX.charts.line = (host, cfg) => {
    if (whenVisible(host, () => TX.charts.line(host, cfg))) return;
    host.innerHTML = ""; host.classList.add("chart-wrap");
    const fmt = cfg.format || ((v) => TX.num(v));
    const legend = document.createElement("div"); legend.className = "legend mb-12";
    cfg.series.forEach((s) => { const sp = document.createElement("span"); const k = document.createElement("span"); k.className = "lk"; k.style.background = s.color; sp.append(k, document.createTextNode(s.name)); legend.appendChild(sp); });
    if (cfg.series.length > 1) host.appendChild(legend);
    const box = document.createElement("div"); box.className = "chart"; host.appendChild(box);
    const W = Math.max(host.clientWidth || 640, 320), H = cfg.height || 240, m = { l: 52, r: 110, t: 10, b: 26 };
    const iw = W - m.l - m.r, ih = H - m.t - m.b, n = cfg.labels.length;
    // Clean ticks: step is 1/2/2.5/5 × 10^k, axis max is a whole number of steps
    const vmax = Math.max(...cfg.series.flatMap((s) => s.values)) * 1.05;
    const step = niceMax(vmax / 4), ticks = Math.ceil(vmax / step), max = step * ticks;
    const x = (i) => m.l + (i / (n - 1)) * iw, y = (v) => m.t + ih - (v / max) * ih;
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.title || "Line chart" }, box);
    for (let i = 0; i <= ticks; i++) { const v = step * i; svgEl("line", { x1: m.l, x2: m.l + iw, y1: y(v), y2: y(v), class: i ? "gridline" : "baseline" }, svg); const tx = svgEl("text", { x: m.l - 8, y: y(v) + 4, "text-anchor": "end", class: "ax-label" }, svg); tx.textContent = cfg.axisFormat ? cfg.axisFormat(v) : fmt(v); }
    const every = Math.ceil(n / 8);
    cfg.labels.forEach((l, i) => { if ((i % every === 0 && n - 1 - i >= every * 0.7) || i === n - 1) { const tx = svgEl("text", { x: x(i), y: H - 6, "text-anchor": i === 0 ? "start" : i === n - 1 ? "end" : "middle", class: "ax-label" }, svg); tx.textContent = l; } });
    if (cfg.series.length === 1) { const s = cfg.series[0]; svgEl("path", { d: `M${x(0)},${y(0)} ` + s.values.map((v, i) => `L${x(i)},${y(v)}`).join(" ") + ` L${x(n - 1)},${y(0)} Z`, fill: s.color, opacity: 0.1 }, svg); }
    cfg.series.forEach((s) => svgEl("path", { d: s.values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" "), fill: "none", stroke: s.color, "stroke-width": 2, "stroke-linejoin": "round", "stroke-linecap": "round" }, svg));
    // end markers + direct labels with collision nudging (leader line when moved)
    const ends = cfg.series.map((s) => ({ s, y0: y(s.values[n - 1]), y: y(s.values[n - 1]) })).sort((a, b) => a.y0 - b.y0);
    for (let i = 1; i < ends.length; i++) if (ends[i].y - ends[i - 1].y < 28) ends[i].y = ends[i - 1].y + 28;
    ends.forEach((e) => {
      svgEl("circle", { cx: x(n - 1), cy: e.y0, r: 4, fill: e.s.color, stroke: "#fff", "stroke-width": 2 }, svg);
      if (Math.abs(e.y - e.y0) > 2) svgEl("path", { d: `M${x(n - 1) + 6},${e.y0} L${x(n - 1) + 12},${e.y}`, stroke: "#c3c2b7", "stroke-width": 1, fill: "none" }, svg);
      const t1 = svgEl("text", { x: x(n - 1) + 14, y: e.y - 1, class: "end-label" }, svg); t1.textContent = fmt(e.s.values[n - 1]);
      const t2 = svgEl("text", { x: x(n - 1) + 14, y: e.y + 12, class: "end-label-sub" }, svg); t2.textContent = e.s.name;
    });
    // crosshair + tooltip
    const g = svgEl("g", { style: "display:none" }, svg);
    const ch = svgEl("line", { y1: m.t, y2: m.t + ih, class: "crosshair" }, g);
    const dots = cfg.series.map((s) => svgEl("circle", { r: 4, fill: s.color, stroke: "#fff", "stroke-width": 2 }, g));
    const tip = tipBox(box);
    const overlay = svgEl("rect", { x: m.l, y: m.t, width: iw, height: ih, fill: "transparent", tabindex: 0, style: "cursor:crosshair;outline:none" }, svg);
    let cur = n - 1;
    const show = (i) => {
      cur = Math.max(0, Math.min(n - 1, i)); g.style.display = ""; ch.setAttribute("x1", x(cur)); ch.setAttribute("x2", x(cur));
      dots.forEach((d, k) => { d.setAttribute("cx", x(cur)); d.setAttribute("cy", y(cfg.series[k].values[cur])); });
      fillTip(tip, cfg.labels[cur], cfg.series.map((s) => ({ name: s.name, value: fmt(s.values[cur]), color: s.color })));
      tip.style.display = "block"; const bw = box.clientWidth / W; const left = x(cur) * bw; tip.style.left = (left > box.clientWidth - 190 ? left - 180 : left + 12) + "px"; tip.style.top = "8px";
    };
    overlay.addEventListener("pointermove", (ev) => { const r = svg.getBoundingClientRect(); const px = ((ev.clientX - r.left) / r.width) * W; show(Math.round(((px - m.l) / iw) * (n - 1))); });
    overlay.addEventListener("pointerleave", () => { g.style.display = "none"; tip.style.display = "none"; });
    overlay.addEventListener("focus", () => show(cur));
    overlay.addEventListener("blur", () => { g.style.display = "none"; tip.style.display = "none"; });
    overlay.addEventListener("keydown", (ev) => { if (ev.key === "ArrowLeft") show(cur - 1); if (ev.key === "ArrowRight") show(cur + 1); });
    tableTwin(host, ["Date", ...cfg.series.map((s) => s.name)], cfg.labels.map((l, i) => [l, ...cfg.series.map((s) => fmt(s.values[i]))]));
  };
  /** Horizontal bars, one series. cfg: {items:[{label,value,sub}], color, format} */
  TX.charts.hbar = (host, cfg) => {
    if (whenVisible(host, () => TX.charts.hbar(host, cfg))) return;
    host.innerHTML = ""; host.classList.add("chart-wrap");
    const fmt = cfg.format || ((v) => TX.num(v));
    const box = document.createElement("div"); box.className = "chart"; host.appendChild(box);
    const W = Math.max(host.clientWidth || 420, 280), rowH = 34, lw = cfg.labelWidth || 130, vr = 78, H = cfg.items.length * rowH + 6;
    const max = niceMax(Math.max(...cfg.items.map((i) => i.value)));
    const svg = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, role: "img", "aria-label": cfg.title || "Bar chart" }, box);
    const iw = W - lw - vr; const tip = tipBox(box);
    svgEl("line", { x1: lw, x2: lw, y1: 0, y2: H, class: "baseline" }, svg);
    cfg.items.forEach((it, k) => {
      const yy = k * rowH + 5, bh = 18, w = Math.max(6, (it.value / max) * iw), r = 4;
      const lab = svgEl("text", { x: lw - 10, y: yy + 13, "text-anchor": "end", class: "ax-label", style: "fill:#475467;font-size:12px" }, svg); lab.textContent = it.label;
      const bar = svgEl("path", { d: `M${lw},${yy} h${w - r} a${r},${r} 0 0 1 ${r},${r} v${bh - 2 * r} a${r},${r} 0 0 1 -${r},${r} h-${w - r} Z`, fill: it.color || cfg.color || "var(--series-1)", class: "bar" }, svg);
      const val = svgEl("text", { x: lw + w + 8, y: yy + 13, class: "end-label" }, svg); val.textContent = fmt(it.value);
      const hit = svgEl("rect", { x: 0, y: yy - 6, width: W, height: rowH, fill: "transparent", tabindex: 0, style: "outline:none" }, svg);
      const on = () => { bar.classList.add("hover"); fillTip(tip, it.label, [{ name: it.sub || cfg.seriesName || "", value: fmt(it.value), color: it.color || cfg.color || "var(--series-1)" }]); tip.style.display = "block"; tip.style.left = Math.min(box.clientWidth - 170, ((lw + w) / W) * box.clientWidth + 12) + "px"; tip.style.top = (yy / H) * box.clientHeight - 6 + "px"; };
      const off = () => { bar.classList.remove("hover"); tip.style.display = "none"; };
      hit.addEventListener("pointerenter", on); hit.addEventListener("pointerleave", off); hit.addEventListener("focus", on); hit.addEventListener("blur", off);
    });
    tableTwin(host, [cfg.labelHeader || "Item", cfg.seriesName || "Value"], cfg.items.map((i) => [i.label, fmt(i.value)]));
  };
  /** 100% stacked bar with 2px surface gaps. cfg: {parts:[{name,value,color}], format} */
  TX.charts.stack = (host, cfg) => {
    host.innerHTML = ""; const fmt = cfg.format || ((v) => TX.num(v));
    cfg = { ...cfg, parts: cfg.parts.filter((p) => p.value > 0) };
    const total = cfg.parts.reduce((a, p) => a + p.value, 0);
    const bar = document.createElement("div"); bar.style.cssText = "display:flex;gap:2px;height:14px;border-radius:4px;overflow:hidden;background:#fff";
    cfg.parts.forEach((p) => { const s = document.createElement("div"); s.style.cssText = `flex:${p.value} 0 0;background:${p.color}`; s.title = `${p.name}: ${fmt(p.value)} (${Math.round((p.value / total) * 100)}%)`; bar.appendChild(s); });
    const leg = document.createElement("div"); leg.className = "legend mt-12";
    cfg.parts.forEach((p) => { const sp = document.createElement("span"); const k = document.createElement("span"); k.className = "lk rect"; k.style.background = p.color; const b = document.createElement("b"); b.style.color = "var(--tx-1)"; b.textContent = Math.round((p.value / total) * 100) + "%"; sp.append(k, document.createTextNode(p.name + " "), b); leg.appendChild(sp); });
    host.append(bar, leg);
  };
  /** Sparkline (de-emphasised history, accent last point). */
  TX.charts.spark = (host, values, color = "var(--series-1)") => {
    const W = 96, H = 28, n = values.length, mn = Math.min(...values), mx = Math.max(...values);
    const x = (i) => 2 + (i / (n - 1)) * (W - 6), y = (v) => H - 3 - ((v - mn) / (mx - mn || 1)) * (H - 6);
    host.innerHTML = `<svg class="spark" viewBox="0 0 ${W} ${H}" aria-hidden="true"><path d="${values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join(" ")}" fill="none" stroke="#c3c2b7" stroke-width="1.5" stroke-linejoin="round"/><circle cx="${x(n - 1)}" cy="${y(values[n - 1])}" r="3" fill="${color}" stroke="#fff" stroke-width="1.5"/></svg>`;
  };
  TX.charts.toggleTable = (host) => host.classList.toggle("show-table");

  /* ------------------------------------------------------------------------ */
  /* Init                                                                      */
  /* ------------------------------------------------------------------------ */
  TX.hydrate = (root = document) => {
    $$("i[data-icon]", root).forEach((i) => {
      const st = i.getAttribute("style");
      i.outerHTML = ic(i.dataset.icon, i.className || "").replace("<svg ", st ? `<svg style="${st}" ` : "<svg ");
    });
    $$("[data-ph]", root).forEach((el) => { el.outerHTML = TX.ph(el.dataset.ph, el.className || "", el.dataset.alt || ""); });
    TX.renderGrids(root);
    TX.renderPrices(root);
    labelTables(root);
  };
  // Tables marked .m-stack become labelled cards on phones: each cell gets its column header as data-label
  function labelTables(root = document) {
    $$("table.m-stack", root.nodeType === 1 && root.matches("table.m-stack") ? root.parentElement : root).forEach((t) => {
      const heads = $$("thead th", t).map((th) => th.textContent.replace(/\s+/g, " ").trim());
      $$("tbody tr, tfoot tr", t).forEach((tr) => { let i = 0; [...tr.cells].forEach((c) => { if (!c.hasAttribute("data-label")) c.setAttribute("data-label", heads[i] || ""); i += c.colSpan || 1; }); });
    });
  }
  TX.labelTables = labelTables;
  const queue = []; let ready = false;
  TX.ready = (fn) => (ready ? fn() : queue.push(fn));

  function init() {
    const app = document.body.dataset.app || "hub";
    const page = document.body.dataset.page || "";
    const as = TX.param("as"); if (["guest", "consumer", "dealer"].includes(as)) { TX.view = as; store.set("view", as); }
    document.body.classList.add("view-" + TX.view);
    buildProtobar(app);
    if (app === "store") buildStoreShell(page);
    if (app === "erp" || app === "vendor") buildWorkspaceShell(app, page);
    TX.hydrate();
    bindEvents();
    TX.setView(TX.view);
    ready = true; queue.forEach((f) => f());
    if (app === "store" && window.MutationObserver) {
      let pending = false;
      new MutationObserver(() => { if (pending) return; pending = true; requestAnimationFrame(() => { pending = false; labelTables(document); }); }).observe(document.body, { childList: true, subtree: true });
    }
    // Deep-link to a tab/modal via #hash — after page scripts have rendered their content
    const applyHash = () => {
      const h = location.hash.slice(1); if (!h) return;
      const t = $(`.tab[data-tab="${h}"]`); if (t) activateTab(t);
      const m = document.getElementById(h); if (m && (m.classList.contains("modal") || m.classList.contains("drawer"))) TX.open(h);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", applyHash); else applyHash();
  }
  init();
  window.addEventListener("hashchange", () => {
    const h = location.hash.slice(1); if (!h) return;
    const t = $(`.tab[data-tab="${h}"]`); if (t) activateTab(t);
    const m = document.getElementById(h); if (m && (m.classList.contains("modal") || m.classList.contains("drawer"))) TX.open(h);
  });
})();
