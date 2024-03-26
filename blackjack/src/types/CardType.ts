export const VALUES = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"] as const;
export const SUITS = ["S", "C", "D", "H"] as const;

export type Value = typeof VALUES[number];
export type Suit = typeof SUITS[number];

export interface Card {
  value: Value,
  suit: Suit,
  image?: string,
  isVisible?: boolean
}
