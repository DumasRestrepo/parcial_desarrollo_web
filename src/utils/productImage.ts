/**
 * Devuelve una URL de imagen de Unsplash relevante para la categoría/nombre del producto.
 * Se usa como fallback cuando la imagen del API no carga o está vacía.
 */

// Imágenes curadas por categoría (Unsplash CDN — estables)
const CATEGORY_IMAGES: Record<string, string> = {
  // Camisetas / Tops
  camiseta:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75&fit=crop',
  camisetas:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75&fit=crop',
  remera:
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=75&fit=crop',
  top: 'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&q=75&fit=crop',
  blusa:
    'https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&q=75&fit=crop',

  // Pantalones / Jeans
  pantalon:
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=75&fit=crop',
  pantalones:
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=75&fit=crop',
  jean: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=75&fit=crop',
  jeans:
    'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=75&fit=crop',
  jogger:
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=75&fit=crop',
  joggers:
    'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=75&fit=crop',

  // Abrigos / Chaquetas
  chaqueta:
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=75&fit=crop',
  chaquetas:
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=75&fit=crop',
  abrigo:
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=75&fit=crop',
  abrigos:
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&q=75&fit=crop',
  hoodie:
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75&fit=crop',
  hoodies:
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75&fit=crop',
  buzo: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75&fit=crop',
  sudadera:
    'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&q=75&fit=crop',

  // Zapatos / Calzado
  zapato:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&fit=crop',
  zapatos:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&fit=crop',
  zapatilla:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&fit=crop',
  zapatillas:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&fit=crop',
  tenis:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&fit=crop',
  sneaker:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=75&fit=crop',
  bota: 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=75&fit=crop',
  botas:
    'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400&q=75&fit=crop',

  // Accesorios
  gorra:
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=75&fit=crop',
  gorras:
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&q=75&fit=crop',
  bolsa:
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=75&fit=crop',
  bolso:
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=75&fit=crop',
  cinturon:
    'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&q=75&fit=crop',

  // Vestidos / Faldas
  vestido:
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=75&fit=crop',
  vestidos:
    'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=75&fit=crop',
  falda:
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=75&fit=crop',
  faldas:
    'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=75&fit=crop',

  // Short / Bermuda
  short:
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=75&fit=crop',
  shorts:
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=75&fit=crop',
  bermuda:
    'https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=400&q=75&fit=crop',
};

// Fallback genérico de ropa
const FALLBACK =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75&fit=crop';

/**
 * Busca la primera palabra del nombre/categoria del producto en el diccionario.
 * Si no encuentra coincidencia, retorna el fallback genérico.
 */
export function getProductFallbackImage(
  nombre: string,
  categoria: string,
): string {
  const tokens = [
    ...nombre.toLowerCase().split(/\s+/),
    ...categoria.toLowerCase().split(/\s+/),
  ];
  for (const token of tokens) {
    const clean = token.replace(/[^a-záéíóúñ]/g, '');
    if (CATEGORY_IMAGES[clean]) return CATEGORY_IMAGES[clean];
  }
  return FALLBACK;
}
