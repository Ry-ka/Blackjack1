import { Card } from "../card";


export async function importCardImage(card: Card): Promise<string> {
  try {
    const module = await import(`../assets/cards/${card.value}${card.suit}.svg`);
    return module.default;
  } catch (error) {
    console.error("Failed to load card image", error);
    return ""; // Return a default image path or keep it empty as needed
  }
}
