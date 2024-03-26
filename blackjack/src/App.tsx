// App.tsx

import React, { useState, useEffect } from 'react';
import { Game } from './models/Game';
import Table from './views/Table';
import { Card } from './types/CardType'
import './App.css'
import Controls from './views/Controls';
import { PlayerAction } from './types/PlayerActionType';
import { Dealer } from './models/Dealer';
import { Deck } from './models/Deck';
import { Player } from './models/Player';

const App: React.FC = () => {
  const [game, setGame] = useState<Game>(new Game(1, 1000));
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [isPlayerTurnActive, setIsPlayerTurnActive] = useState<boolean>(false);
  const [betSliderValue, setBetSliderValue] = useState<number>(15);
  const [playerTotal, setPlayerTotal] = useState<number>(0);
  const [dealerTotal, setDealerTotal] = useState<number>(0);


  const handlePlayerAction = (action: PlayerAction) => {
    // Invoke the action on the game object
    game.playerAction(action);
  
    // Trigger a React state update to re-render the component with the new game state
    // Use a functional state update to make sure you're working with the most current state
    setGame(prevGame => {
      // Create a new instance of the game (or clone the state as needed)
      // This is necessary to ensure React detects a state change and updates the component
      const newGame = new Game(prevGame.players.length, prevGame.players[0].currentBalance);
      // Replicate the state from the existing game object to the new one
      Object.assign(newGame, prevGame);
      // Clone players if they have methods that need to be preserved
      newGame.players = prevGame.players.map(player => Object.assign(new Player(player.currentBalance), player));
      // Clone dealer and deck if necessary
      newGame.dealer = Object.assign(new Dealer(), prevGame.dealer);
      newGame.deck = Object.assign(new Deck(), prevGame.deck);
  
      return newGame;
    });
  
    // Update the hands in the state
    setPlayerHand([...game.players[game.currentPlayerIndex].hands[0].cards]);
    setDealerHand([...game.dealer.getHand()]);
    setPlayerTotal(game.players[game.currentPlayerIndex].calculateHandTotal(0));
    setDealerTotal(game.dealer.calculateHandValue());

    const currentPlayer = game.players[game.currentPlayerIndex];
  
    // If the player has busted or decided to stand, the player's turn is over
    if (currentPlayer.hasBusted(0) || action === 'stand') {
      setIsPlayerTurnActive(false);
  
      // If this is the last player, handle the dealer's turn
      if (game.currentPlayerIndex >= game.players.length - 1) {
        // Invoke the dealer's turn
        game.handleDealerTurn();
        // Update the dealer's hand in the state
        setDealerHand([...game.dealer.getHand()]);
        // Since state updates are asynchronous, we may need to use a callback here to make sure they are processed
      }
    }
  };
  
  

  const submitBet = () => {
    setGame(prevGame => {
      // Clone the previous game state to ensure immutability
      const newGame = new Game(prevGame.players.length, prevGame.players[0].currentBalance);
  
      // Use methods to transfer state from the old game instance to the new one
      // For example, clone the deck, dealer, and player states
      
      const currentPlayer = newGame.players[0];
      
      if (betSliderValue <= currentPlayer.currentBalance && betSliderValue >= 15) {
        currentPlayer.placeBet(betSliderValue, 0);
  
        try {
          console.log("before");
          newGame.startNewRound();
          console.log("after");
          
          // Update the React state with the new game state
          setPlayerHand([...newGame.players[newGame.currentPlayerIndex].hands[0].cards]);
          setDealerHand([...newGame.dealer.getHand()]);
          setPlayerTotal(newGame.players[newGame.currentPlayerIndex].calculateHandTotal(0));
          setDealerTotal(newGame.dealer.calculateHandValue());

          setIsPlayerTurnActive(true);

          return newGame;
        } catch (error) {
          console.error(error);
          return prevGame;
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
    const newGame = new Game(1, 1000); // For example: 1 player, $1000 starting balance
    setGame(newGame);

    // Assuming you want to display the player's cards:
    setPlayerHand(newGame.players[0].hands[0].cards);
    setDealerHand(newGame.dealer.getHand());
  }, []);

  return (
    <div className="app">
      <Table 
        dealerCards={dealerHand} 
        playerCards={playerHand}
        dealerTotal={dealerTotal}
        playerTotal={playerTotal}
        // Optional: message={...}
      />
      <div className="playerInteraction">
        <div className="bettingControls">
        <input
          type="range"
          min="15"
          max={game.players[0].currentBalance.toString()}
          value={betSliderValue.toString()}
          onChange={handleSliderChange}
        />
        <button onClick={submitBet}>Submit Bet</button>
        <Controls onPlayerAction={handlePlayerAction} isPlayerTurnActive={isPlayerTurnActive}/>
        </div>
      </div>
    </div>
  );
};


export default App;
