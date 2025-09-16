export function getImage(image: string) {
  try {
    return new URL(`../assets/images/${image}`, import.meta.url).href;
  } catch {
    return new URL("../assets/images/default.webp", import.meta.url).href;
  }
}
