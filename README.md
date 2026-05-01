# Malditos Picos — malditospicos.com

Blog de tenis de mesa construido con Astro 4 + Vercel.

## Stack
- **Astro 4** — Framework estático
- **Keystatic CMS** — Panel de administración (pendiente configurar)
- **Vercel** — Hosting y deploy
- **Umami** — Analytics sin cookies (pendiente configurar)

## Estructura
```
src/
  content/         ← Posts en Markdown por categoría
    gomas/         ← 27 posts
    maderas/       ← 26 posts
    palas/         ← 32 posts
    tecnica/       ← 23 posts
    guias/         ← 26 posts
    jugadores/     ← 33 posts
    materiales/    ← 16 posts
    recursos/      ← 9 posts
  layouts/         ← BaseLayout + PostLayout
  components/      ← PostCard
  pages/           ← index, [category]/index, [category]/[slug]
  styles/          ← global.css
public/
  robots.txt
vercel.json        ← 192 redirecciones 301 de URLs antiguas de Blogger
```

## Comandos
```bash
npm install
npm run dev      # localhost:4321
npm run build    # genera /dist
```

## Deploy en Vercel
1. Push a GitHub
2. Importar repo en Vercel
3. Build command: `npm run build`
4. Output dir: `dist`
5. Apuntar dominio malditospicos.com en Dondominio → nameservers de Vercel

## Pendiente
- [ ] Configurar Keystatic CMS
- [ ] Configurar Umami Analytics
- [ ] Revisar y limpiar imágenes (actualmente apuntan a blogger.googleusercontent.com)
- [ ] Añadir Schema Product/Review en posts de gomas y maderas
- [ ] Verificar Search Console con nueva URL
- [ ] Configurar dominio en Vercel
