export const brand = {
  logo: "/assets/full_logo.png",
  emblem: "/assets/logo_emblem.png",
  emblemSvg: "/assets/logo_emblem.svg",
};
export const ui = {
  home: "/assets/optimized/home.webp",
  search: "/assets/optimized/search.webp",
  searchResults: "/assets/optimized/product_catalog.webp",
  product: "/assets/optimized/product.webp",
  collection: "/assets/optimized/collections.webp",
  profile: "/assets/optimized/profile.webp",
  signIn: "/assets/optimized/sign_in.webp",
};
const names = [
  "Ivory floral shirt dress",
  "Forest green wrap dress",
  "Indigo denim sundress",
  "Sky blue embroidered dress",
  "Espresso draped midi dress",
  "Black button-front shirt dress",
  "Chocolate tie-neck dress",
  "Black ruched column dress",
  "Pink floral summer dress",
  "Indigo belted denim dress",
  "Ochre sleeveless dress",
  "Plum sheer-sleeve dress",
  "Monochrome print shirt dress",
  "Blue sleeveless denim dress",
  "Peach floral slip dress",
  "Chocolate belted shirt dress",
  "Black fit-and-flare dress",
  "Ivory square-neck dress",
  "Deep teal flowing dress",
  "Pale blue smocked dress",
];
export const products = names.map((alt, i) => ({
  id: i + 1,
  src: "/assets/optimized/product" + (i + 1) + ".webp",
  original: "/assets/products/product" + (i + 1) + ".jpg",
  alt,
  width: 480,
  height: 720,
}));
