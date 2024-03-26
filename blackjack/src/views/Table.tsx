// Table.tsx
import React from 'react';
import DealerArea from './DealerArea';
import PlayerArea from './PlayerArea';
import { Card as CardType } from '../types/CardType';
import './Table.css'

interface TableProps {
  dealerCards: CardType[];
  playerCards: CardType[];
  dealerTotal?: number;
  playerTotal?: number;
  message?: string;
}

const Table: React.FC<TableProps> = ({
  dealerCards,
  playerCards,
  dealerTotal,
  playerTotal,
  message
}) => {
  return (
    <div className="table">
      <DealerArea cards={dealerCards} total={dealerTotal} message={message} />
      {/* Other table elements like the title or a message */}
      <PlayerArea cards={playerCards} total={playerTotal} />
    </div>
  );
};

export default Table;
