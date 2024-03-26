import { Card } from '../types/CardType';

export class Dealer {
  public hand: Card[] = [];

  // Adds a card to the dealer's hand
  addCardToHand(card: Card): void {
    this.hand.push(card);
  }

  clearHand(): void {
    this.hand = [];
  }

  // Dealer's logic to determine if they should hit or stand
  shouldHit(): boolean {
    const handValue = this.calculateHandValue();
    const isSoft17 = this.hand.some(card => card.value === 'A') && handValue === 17 && this.hand.some(card => card.value !== 'A' && card.value !== '7');

  
    // Dealer hits on soft 17
    
    return handValue < 17 || isSoft17;
  }
  

  // Calculate the value of the dealer's hand
  calculateHandValue(): number {
    let value = 0;
    let aces = 0;

    // Implement the logic to calculate the value of the hand
    for (const card of this.hand) {
      if (card.value === 'A') {
        aces += 1;
      } else if (['J', 'Q', 'K'].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value);
      }
    }

    // taking into account the value of aces
    for (let i = 0; i< aces; i++) {
      if (value + 11 <= 21) {
        value += 11;
      } else {
        value += 1;
      }
    }

    return value; 
  }

  // Get the dealer's current hand
  getHand(): Card[] {
    return this.hand;
  }
}
