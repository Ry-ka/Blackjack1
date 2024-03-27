// PlayerArea.tsx

import React from 'react';
import Card from './Card';
import { Card as CardType } from '../types/CardType';
import './PlayerArea.css';

interface PlayerAreaProps {
  cards: CardType[];
  total?: number;
  bet?: number;
  // Include any other props you might need, like a message or player action buttons
}

const PlayerArea: React.FC<PlayerAreaProps> = ({ cards, total, bet }) => {
  return (
    <div className="player-area">
      {total !== undefined && <div className="total">Player Total: {total}</div>}
      {bet !== undefined && <div className="bet">Bet: ${bet}</div>} {/* Display the bet amount */}
      <div className="cards">
        {cards.map((card, index) => (
          <Card key={`player-card-${index}`} card={card} className="player-card" />
        ))}
      </div>
    </div>
  );
};

export default PlayerArea;
