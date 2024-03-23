import { useEffect, useState } from 'react';
import { Card, SUITS, VALUES } from '../card';
import { importCardImage } from '../utils/utils'; // Assuming the importCardImage function is exported from utils

const DeckComponent = () => {
  const [deck, setDeck] = useState<Card[]>([]);

  function buildDeck(): Card[] {
    const deck: Card[] = [];
    const DECK_COUNT = 4;

    for (let i = 0; i < DECK_COUNT; i++) {
      for (const suit of SUITS) {
        for (const value of VALUES) {
          // Create a card object for each combination of suit and value
          const card: Card = {
            suit: suit,
            value: value,
          };
          deck.push(card);
        }
      }
    }

    return deck;
  }

  useEffect(() => {
    const initializeDeck = async () => {
      const initialDeck = buildDeck(); 
      for (const card of initialDeck) {
        card.image = await importCardImage(card); // Assign the image to each card
      }
      setDeck(initialDeck);
    };

    initializeDeck();
  }, []);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
      {deck.map((card, index) => (
        <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} style={{ width: '100px', margin: '10px' }} />
      ))}
    </div>
  );
};

export default DeckComponent;
