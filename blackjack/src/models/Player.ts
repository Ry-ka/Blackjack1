import { Card } from "../types/CardType";
import { Hand } from "../types/HandType";


export class Player {
  hands: Hand[] = [];
  currentBalance: number;
  hasPlacedBet: boolean;

  constructor(initialBalance: number) {
    this.currentBalance = initialBalance;
    this.hands.push({ cards: [], bet: 0 });
    this.hasPlacedBet = false;
  }

  clearHands(): void {
    this.hands = [{ cards: [], bet: 0 }];
  }

  addCardToHand(card: Card, handIndex: number): void {
    if (handIndex < this.hands.length) {
      this.hands[handIndex].cards.push(card);
    } else {
      console.error('Hand index out of bounds');
      // add logic to handle when player is out of hands
    }
  }
  public hasBusted(handIndex: number): boolean {
    return this.calculateHandTotal(handIndex) > 21;
  }

  public calculateHandTotal(handIndex: number): number {
    const hand = this.hands[handIndex];
    let total = 0;
    let aceCount = 0;

    for (const card of hand.cards) {
      if (card.isVisible) { // Only count the total of visible cards
        if (card.value === 'A') {
          total += 11;
          aceCount += 1;
        } else if (['J', 'Q', 'K'].includes(card.value)) {
          total += 10;
        } else {
          total += parseInt(card.value, 10);
        }
      }
    }

    // Adjust for Aces after counting the rest
    while (total > 21 && aceCount > 0) {
      total -= 10; // An Ace is counted as 1 instead of 11
      aceCount -= 1;
    }

    return total;
  }

  placeBet(amount: number, handIndex: number): void {
    console.log(this.currentBalance);
    if (this.currentBalance >= amount && handIndex < this.hands.length) {
      this.hands[handIndex].bet += amount;
      this.currentBalance -= amount;
      this.hasPlacedBet = true;
    } else {
      console.error('Insufficient balance or hand index out of bounds');
    }
  }

  

  public updateBalance(amount: number): void {
    this.currentBalance += amount;
  }

  win(handIndex: number): void {
    // 1:1 payout
    const winnings = this.hands[handIndex].bet * 2;
    console.log("Won!");
    console.log(winnings);
    this.currentBalance += winnings;

    this.hands[handIndex].bet = 0;
  }

  lose(handIndex: number): void {
    // do nothing as the amount is already deducted
    this.hands[handIndex].bet = 0;
  }

  push(handIndex: number): void {
    // Return the bet
    const bet = this.hands[handIndex].bet;
    this.currentBalance += bet;
    // Optionally clear the bet after push
    this.hands[handIndex].bet = 0;
  }

  blackjack(handIndex: number) : void {
    // 2:1 payout
    const originalBet = this.hands[handIndex].bet;
    const winnings = originalBet * 1.5; 
    console.log("Blackjack!");
    this.currentBalance += (originalBet + winnings);

    this.hands[handIndex].bet = 0;
  }

  hasBlackjack(handIndex: number): boolean {
    const hand = this.hands[handIndex];
    if (hand.cards.length === 2) {
      const total = this.calculateHandTotal(handIndex);
      return total === 21;
    }
    return false;
  }
}
