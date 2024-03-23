export const SUITS = ["C","H","D","S"];
export const VALUES = ["A","2","3","4","5","6","7","8","9","10","J","Q","K"];

export interface Card {
  suit: string;
  value: string;
  image?: string;
  flipped?: boolean;
}

