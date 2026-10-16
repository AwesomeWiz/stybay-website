import { productCatalog } from "./productCatalog";
import display from "./productDisplay.json";
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
export const products = productCatalog.map(({ id, alt, extension }) => ({
  id,
  src: `/assets/optimized/product${id}.webp?v=${display.revisions[String(id) as keyof typeof display.revisions]}`,
  original: `/assets/products/product${id}.${extension}`,
  alt,
  width: display.width,
  height: display.height,
}));
