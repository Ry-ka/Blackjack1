// Card.tsx

import './Card.css'
import React from 'react';
import { Card as CardType } from '../types/CardType';
import cardBack from '/assets/back.svg'; 

interface CardProps {
  card: CardType;
  className?: string;
}

const Card: React.FC<CardProps> = ({ card, className }) => {
  const classes = `card ${className || ''}`.trim();

  return (
    <div className={classes}>
    {card.isVisible 
      ? <img src={card.image} alt={`${card.value} of ${card.suit}`} />
      : <img src={cardBack} alt="Card back" />
    }
    </div>
  );
};

export default Card;
