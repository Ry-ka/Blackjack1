// App.tsx

import React, { useState, useEffect } from 'react';
import { Game } from './models/Game';
import Table from './views/Table';
import { Card } from './types/CardType'
import './App.css'
import Controls from './views/Controls';
import { PlayerAction } from './types/PlayerActionType';
import { Dealer } from './models/Dealer';
import { Player } from './models/Player';

type GameState = {
  playerHands: Array<{
    cards: Card[];
    bet: number;
  }>;

  dealerHand: Card[];
  playerTotal: number;
  dealerTotal: number;
  isPlayerTurnActive: boolean;
};

const App: React.FC = () => {
  const [game, setGame] = useState<Game>(new Game(1, 1000));
  const [gameState, setGameState] = useState<GameState>({
    playerHands: [{
      cards: [],
      bet: 0
    }],
    dealerHand: [],
    playerTotal: 0,
    dealerTotal: 0,
    isPlayerTurnActive: false
  });
  const [betSliderValue, setBetSliderValue] = useState<number>(15);


  const handlePlayerAction = (action: PlayerAction) => {
    game.playerAction(action);

    setGame(prevGame => {
        // Clone the game state to ensure immutability
        const newGame = new Game(prevGame.players.length, prevGame.players[0].currentBalance, false);
        Object.assign(newGame, prevGame);
        newGame.players = prevGame.players.map(player => {
            const clonedPlayer = Object.assign(new Player(player.currentBalance), player);
            clonedPlayer.hands = player.hands.map(hand => ({
                ...hand,
                cards: [...hand.cards],
            }));
            return clonedPlayer;
        });
        newGame.dealer = Object.assign(new Dealer(), prevGame.dealer);
        newGame.deck = prevGame.deck.clone();

        // Update the consolidated game state
        const updatedGameState: GameState = {
            playerHands: [{
              cards: [...newGame.players[newGame.currentPlayerIndex].hands[0].cards],
              bet: newGame.players[newGame.currentPlayerIndex].hands[0].bet
            }],
            dealerHand: [...newGame.dealer.getHand()],
            playerTotal: newGame.players[newGame.currentPlayerIndex].calculateHandTotal(0),
            dealerTotal: newGame.dealer.calculateHandValue(),
            isPlayerTurnActive: !newGame.players[newGame.currentPlayerIndex].hasBusted(0)
        };

        setGameState(updatedGameState);

        if (!updatedGameState.isPlayerTurnActive || action === 'stand') {
            if (newGame.currentPlayerIndex >= newGame.players.length - 1) {
                newGame.handleDealerTurn();
                updatedGameState.dealerHand = [...newGame.dealer.getHand()];
                setGameState(updatedGameState); // Update dealer's hand after dealer's turn
            }
        }

        return newGame;
    });
};


const submitBet = () => {
  setGame(prevGame => {
      // Clone the previous game state to ensure immutability
      const newGame = new Game(prevGame.players.length, prevGame.players[0].currentBalance, false);
      newGame.deck = prevGame.deck.clone();
      newGame.players[0].hands[0].bet = prevGame.players[0].hands[0].bet;

      const currentPlayer = newGame.players[0];

      if (betSliderValue <= currentPlayer.currentBalance && betSliderValue >= 15) {
          currentPlayer.placeBet(betSliderValue, 0);

          try {
              newGame.startNewRound();

              // Calculate the new state after starting a new round
              const updatedGameState = {
                playerHands: [{
                  cards: [...newGame.players[newGame.currentPlayerIndex].hands[0].cards],
                  bet: betSliderValue
                }],
                dealerHand: [...newGame.dealer.getHand()],
                playerTotal: newGame.players[newGame.currentPlayerIndex].calculateHandTotal(0),
                dealerTotal: newGame.dealer.calculateHandValue(),
                isPlayerTurnActive: true
              };

              // Update the gameState with the new values
              setGameState(updatedGameState);

              return newGame;
          } catch (error) {
              console.error(error);
              return prevGame; // Keep the previous state if there's an error
          }
      } else {
          alert("Invalid bet amount.");
          return prevGame;
      }
  });
};

  
  

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newBetValue = parseInt(event.target.value, 10);
    setBetSliderValue(newBetValue);
  };
  



  useEffect(() => {
    const currentPlayer = game.players[game.currentPlayerIndex];

    const updatedState: GameState = {
      playerHands: currentPlayer.hands.map(hand => ({
        cards: [...hand.cards], // Clone the cards for immutability
        bet: hand.bet, // Take the bet from each hand
      })),
      dealerHand: [...game.dealer.getHand()],
      playerTotal: currentPlayer.calculateHandTotal(0),
      dealerTotal: game.dealer.calculateHandValue(),
      isPlayerTurnActive: !currentPlayer.hasBusted(0) && currentPlayer.hands[0].cards.length > 0
    };

    setGameState(updatedState);
  }, [game]);

  return (
    <div className="app">
      <Table 
        dealerCards={gameState.dealerHand} 
        playerCards={gameState.playerHands[0].cards}
        dealerTotal={gameState.dealerTotal}
        playerTotal={gameState.playerTotal}
        bet = {gameState.playerHands[0].bet}
      />
      <div className="playerInteraction">
        <div className="bettingControls">
          <p className="current-balance">Current Balance: ${game.players[0].currentBalance}</p> {/* Display current balance */}
          <input
            type="range"
            min="15"
            max={game.players[0].currentBalance.toString()}
            value={betSliderValue.toString()}
            onChange={handleSliderChange}
          />
          <p className="bet-amount">Bet Amount: ${betSliderValue}</p>
          <button onClick={submitBet}>Submit Bet</button>
          <Controls onPlayerAction={handlePlayerAction} isPlayerTurnActive={gameState.isPlayerTurnActive}/>
        </div>
      </div>
    </div>
  );
};


export default App;
