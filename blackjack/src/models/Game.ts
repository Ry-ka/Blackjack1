import { Card } from "../types/CardType";
import { PlayerAction } from "../types/PlayerActionType";
import { Dealer } from "./Dealer";
import { Deck } from "./Deck";
import { Player } from "./Player";


export class Game {
  public players: Player[];
  public deck: Deck;
  public dealer: Dealer;
  public currentPlayerIndex: number;

  constructor(playerCount: number, startingBalance: number) {
    this.deck = new Deck();
    this.dealer = new Dealer();
    this.players = this.createPlayers(playerCount, startingBalance);
    this.currentPlayerIndex = 0;
  }

  private createPlayers(playerCount: number, startingBalance: number): Player[] {
    const players: Player[] = [];
    for (let i = 0; i< playerCount; i++) {
      players.push(new Player(startingBalance));
    }
    return players;
  }

  public startNewRound(): void {

    if (this.deck.needsReshuffle()) {
      console.log("shuffling");
      this.deck = new Deck(6);
      this.deck.shuffle();
    }

    this.players.forEach((player) => {
      player.clearHands();
    });
    this.dealer.clearHand();

    this.players.forEach(player => {
      if (!player.hasPlacedBet) {
        // throw new Error("Not all players have placed a bet");
      }
    })
    this.dealInitialCards();
  }

  private dealInitialCards(): void {
    // Deal two cards to each player
    for (let i = 0; i < 2; i++) {
      for (const player of this.players) {
        const card = this.deck.dealCard();
        if (card) {
          card.isVisible = true;
          player.addCardToHand(card, 0);
        } else {
          // Handle the scenario where the deck is unexpectedly empty
          // Perhaps reshuffle and restart, notify players, etc.
        }
      }

      // Deal to the dealer, the first card is visible, the second is hidden
      const dealerCard = this.deck.dealCard();
      if (dealerCard) {
        dealerCard.isVisible = true;
        this.dealer.addCardToHand(dealerCard);
      } else {
        // Handle the scenario where the deck is unexpectedly empty
        // Similar to above, reshuffle and restart, notify players, etc.
      }
    }
    // After dealing, the dealer's second card should be set to hidden
    if (this.dealer.hand[1]) {
      this.dealer.hand[1].isVisible = false;
    }
  }

  updateState(newPlayerBalance: number[]): void {
    this.players[0].currentBalance = newPlayerBalance[0];
  }



  public playerAction(action: PlayerAction): void {
    const player = this.players[this.currentPlayerIndex];
  
    switch(action) {
      case 'hit': {
        const newCard : Card | null = this.deck.dealCard();
        if (newCard) {
          newCard.isVisible = true; // Assuming you want to show the card immediately
          player.addCardToHand(newCard, 0);
          // Optionally, check if player has busted

          if (player.hasBusted(0)) { //replace the 0 with the actual hand index when implementing splitting
            this.moveToNextPlayer();
            return;
          }
        } else {
          // Handle no more cards in the deck
        }
      }
        break;
      case 'stand':
        this.moveToNextPlayer();
        break;
      // Additional cases for double, split, surrender
    }
  }

  public moveToNextPlayer(): void {
    // Move to the next player; if last player, dealer's turn
    if (this.currentPlayerIndex < this.players.length - 1) {
      this.currentPlayerIndex++;
    } else {
      this.handleDealerTurn();
    }
  }

  public handleDealerTurn(): void {
    // Reveal dealer's second card
    if (this.dealer.hand[1]) {
      this.dealer.hand[1].isVisible = true;
    }
    // Dealer plays according to the dealer rules
    while (this.dealer.shouldHit()) {
      console.log("the dealer should hit");
      const newCard : Card | null = this.deck.dealCard();
      if (newCard) {
        newCard.isVisible = true;
        this.dealer.addCardToHand(newCard);
      }
    }
    // Then determine the outcome of the round
    this.determineOutcome();
  }

  private determineOutcome(): void {
    const dealerTotal = this.dealer.calculateHandValue();

    this.players.forEach(player => {
      // Assuming each player has only one hand at index 0
      const playerTotal = player.calculateHandTotal(0);

      if (playerTotal > 21) {
        player.lose(); // Lose doesn't need the bet amount
      } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
        player.win(0); // Win uses the bet from the hand at index 0
      } else if (playerTotal < dealerTotal) {
        player.lose(); // Lose doesn't need the bet amount
      } else {
        player.push(0); // Push uses the bet from the hand at index 0
      }
    });

    this.players.forEach(player => {
      player.hasPlacedBet = false;
    });

  }

  // Additional methods for handling game rules, payouts, etc.
}
