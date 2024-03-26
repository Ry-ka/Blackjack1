// DealerArea.tsx
import React from 'react';
import Card from './Card';
import { Card as CardType } from '../types/CardType';
import './DealerArea.css'

interface DealerAreaProps {
  cards: CardType[];
  total?: number;
  message?: string;
}

const DealerArea: React.FC<DealerAreaProps> = ({ cards, total, message }) => {
  return (
    <div className="dealer-area">
      <div className="dealer-cards">
        {cards.map((card, index) => (
          <Card key={`dealer-card-${index}`} card={card} className="dealer-card" />
        ))}
      </div>
      {total !== undefined && <div className="total">Dealer's Total: {total}</div>}
      {message && <div className="message">{message}</div>}
    </div>
  );
};

export default DealerArea;


