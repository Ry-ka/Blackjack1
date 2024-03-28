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

    constructor(playerCount: number, startingBalance: number, shouldShuffle: boolean = true) {
      this.deck = new Deck(6, shouldShuffle); // Shuffle only if shouldShuffle is true
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
      console.log("starting new round!");
      if (this.deck.needsReshuffle()) {
        this.deck = new Deck(6);
        this.deck.shuffle();
      }
      
      const bets = this.players.map(player => player.hands[0].bet);
      this.players.forEach((player, index) => {
        player.clearHands();
        player.hands[0].bet = bets[index];
      });
      this.dealer.clearHand();
      
      this.players.forEach(player => {
        if (!player.hasPlacedBet) {
          console.log("Bets have not been placed yet!");
          // throw new Error("Not all players have placed a bet");
        }
      })
      this.dealInitialCards();
    }

    private dealInitialCards(): void {
      // Deal two cards to each player
      console.log("dealing initial cards");
      console.log(this.players[0].hands[0].bet);
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

      //check for blackjack
      this.players.forEach(player => {
        if (player.hasBlackjack(0)) {
          console.log("Blackjack!");
          if (!this.dealer.hasBlackjack()) {
            player.blackjack(0);
          } else {
            player.push(0);
          }
        }
      });

      if (this.dealer.hasBlackjack()) {
        console.log("dealer blackjack");
        if (this.dealer.hand[1]) {
          this.dealer.hand[1].isVisible = true;
        }
        this.players.forEach(player => {
          if (player.hasBlackjack(0)) {
            player.push(0);
          } else {
            player.lose(0);
          }
        })
      }
    }

    updateState(newPlayerBalance: number[]): void {
      this.players[0].currentBalance = newPlayerBalance[0];
    }



    public playerAction(action: PlayerAction): string {
      const player = this.players[this.currentPlayerIndex];
    
      switch(action) {
        case 'hit': {
          const newCard : Card | null = this.deck.dealCard();
          if (newCard) {
            newCard.isVisible = true; // Assuming you want to show the card immediately
            player.addCardToHand(newCard, 0);
            // Optionally, check if player has busted

            if (player.hasBusted(0)) { //replace the 0 with the actual hand index when implementing splitting
              return this.moveToNextPlayer();
            }
          } else {
            // Handle no more cards in the deck
            return "";
          }
          break;
        }
        case 'stand':
          return this.moveToNextPlayer();
        case 'double':
          if (this.canDoubleDown(this.currentPlayerIndex)) {
            const doubleBet = player.hands[0].bet;
            if (player.currentBalance >= doubleBet) {
              player.currentBalance -= doubleBet;
              player.hands[0].bet += doubleBet;

              // Deal one more card and end the player's turn\
              const newCard = this.deck.dealCard();
              if (newCard) {
                newCard.isVisible = true;
                player.addCardToHand(newCard, 0);
              }
              return this.moveToNextPlayer();
            } else {
              return "Not enough balance to double down.";
            }
          } else {
            return "cannot double down at this time."; // should never reach this if button is disabled and enabled correctly.
          }
        // Additional cases for split, surrender
      }

      return "";
    }

    public moveToNextPlayer(): string {
      // Move to the next player; if last player, dealer's turn
      if (this.currentPlayerIndex < this.players.length - 1) {
        this.currentPlayerIndex++;
        return "next player's turn"
      } else {
        return this.handleDealerTurn();
      }
    }

    public handleDealerTurn(): string {
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
      return this.determineOutcome();
    }

    private determineOutcome(): string {
      const dealerTotal = this.dealer.calculateHandValue();
      let message = '';
      this.players.forEach(player => {
        // Assuming each player has only one hand at index 0
        const playerTotal = player.calculateHandTotal(0);

        if (playerTotal > 21) {
          player.lose(0); // Lose doesn't need the bet amount
          message = 'Bust you lose!';
        } else if (dealerTotal > 21 || playerTotal > dealerTotal) {
          player.win(0); // Win uses the bet from the hand at index 0
          message = 'You win!';
        } else if (playerTotal < dealerTotal) {
          player.lose(0); // Lose doesn't need the bet amount
          message = 'You lose!';
        } else {
          player.push(0); // Push uses the bet from the hand at index 0
          message = 'Push!';
        }
      });

      this.players.forEach(player => {
        player.hasPlacedBet = false;
      });

      return message;
    }
    
    canDoubleDown(playerIndex: number): boolean {
      const player = this.players[playerIndex];
      const isFirstMove = player.hands[0].cards.length === 2;
      return isFirstMove;
    }

    // Additional methods for handling game rules, payouts, etc.
  }
