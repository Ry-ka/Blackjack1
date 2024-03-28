// Controls.tsx

import React from 'react';
import './Controls.css';
import { PlayerAction } from '../types/PlayerActionType';


interface ControlsProps {
  onPlayerAction: (action: PlayerAction) => void;
  isPlayerTurnActive: boolean;
  canDoubleDown: boolean;
}

const Controls: React.FC<ControlsProps> = ({ onPlayerAction, isPlayerTurnActive, canDoubleDown }) => {
  return (
    <div className="controls">
      <button onClick={() => onPlayerAction('hit')} disabled={!isPlayerTurnActive}>Hit</button>
      <button onClick={() => onPlayerAction('stand')} disabled={!isPlayerTurnActive}>Stand</button>
      <button disabled={!isPlayerTurnActive}>Split</button>
      <button onClick={() => onPlayerAction('double')} disabled={!isPlayerTurnActive || !canDoubleDown}>Double Down</button>
      {/* Add more buttons as needed */}
    </div>
  );
};

export default Controls;
