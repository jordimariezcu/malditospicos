import { config, fields, collection } from '@keystatic/core';

const isProduction = process.env.NODE_ENV === 'production';

// Campos compartidos por todas las colecciones
const baseSchema = {
  description: fields.text({
    label: 'Descripción (SEO)',
    multiline: true,
  }),
  pubDate: fields.date({ label: 'Fecha de publicación' }),
  updatedDate: fields.date({ label: 'Última actualización' }),
  draft: fields.checkbox({ label: 'Borrador', defaultValue: false }),
  tags: fields.array(
    fields.text({ label: 'Tag' }),
    { label: 'Tags', itemLabel: (props) => props.value }
  ),
  image: fields.text({ label: 'Imagen URL (opcional)' }),
};

// Campos para productos (gomas, maderas, palas)
const productSchema = {
  ...baseSchema,
  brand: fields.text({ label: 'Marca' }),
  rating: fields.number({
    label: 'Valoración (1-5)',
    validation: { min: 1, max: 5 },
  }),
};

// Campo de contenido markdown (cuerpo del post)
// Usamos markdoc con extension:'md' para leer los archivos .md existentes
const contentField = fields.markdoc({
  label: 'Contenido',
  extension: 'md',
});

export default config({
  storage: isProduction
    ? {
        kind: 'github',
        repo: {
          owner: 'jordimariezcu',
          name: 'malditospicos',
        },
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Malditos Picos' },
    navigation: {
      Contenido: ['jugadores', 'tecnica', 'guias'],
      Material: ['gomas', 'maderas', 'palas'],
      Otros: ['materiales', 'recursos'],
    },
  },

  collections: {
    // ── JUGADORES ──────────────────────────────────────────
    jugadores: collection({
      label: 'Jugadores',
      slugField: 'title',
      path: 'src/content/jugadores/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nombre del jugador' } }),
        ...baseSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'jugadores' }),
        nationality: fields.text({ label: 'Nacionalidad' }),
        birthDate: fields.date({ label: 'Fecha de nacimiento' }),
        worldRanking: fields.number({ label: 'Ranking mundial' }),
        content: contentField,
      },
    }),

    // ── GOMAS ──────────────────────────────────────────────
    gomas: collection({
      label: 'Gomas',
      slugField: 'title',
      path: 'src/content/gomas/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nombre de la goma' } }),
        ...productSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'gomas' }),
        content: contentField,
      },
    }),

    // ── MADERAS ────────────────────────────────────────────
    maderas: collection({
      label: 'Maderas',
      slugField: 'title',
      path: 'src/content/maderas/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nombre de la madera' } }),
        ...productSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'maderas' }),
        content: contentField,
      },
    }),

    // ── PALAS ──────────────────────────────────────────────
    palas: collection({
      label: 'Configuraciones de palas',
      slugField: 'title',
      path: 'src/content/palas/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Nombre de la configuración' } }),
        ...productSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'palas' }),
        content: contentField,
      },
    }),

    // ── TÉCNICA ────────────────────────────────────────────
    tecnica: collection({
      label: 'Técnica',
      slugField: 'title',
      path: 'src/content/tecnica/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        ...baseSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'tecnica' }),
        content: contentField,
      },
    }),

    // ── GUÍAS ──────────────────────────────────────────────
    guias: collection({
      label: 'Guías',
      slugField: 'title',
      path: 'src/content/guias/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        ...baseSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'guias' }),
        content: contentField,
      },
    }),

    // ── MATERIALES ─────────────────────────────────────────
    materiales: collection({
      label: 'Materiales',
      slugField: 'title',
      path: 'src/content/materiales/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        ...baseSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'materiales' }),
        content: contentField,
      },
    }),

    // ── RECURSOS ───────────────────────────────────────────
    recursos: collection({
      label: 'Recursos',
      slugField: 'title',
      path: 'src/content/recursos/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Título' } }),
        ...baseSchema,
        category: fields.text({ label: 'Categoría', defaultValue: 'recursos' }),
        content: contentField,
      },
    }),
  },
});
