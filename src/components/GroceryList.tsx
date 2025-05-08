import React, { useState, KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';

interface GroceryListProps {
  groceryItems: string[];
  onAddItem: (item: string) => void;
  onRemoveItem: (index: number) => void;
}

const GroceryList = ({ 
  groceryItems, 
  onAddItem, 
  onRemoveItem 
}: GroceryListProps) => {
  const [newItem, setNewItem] = useState('');

  const attemptAddItem = () => {
    const trimmedItem = newItem.trim();
    if (trimmedItem) {
      onAddItem(trimmedItem);
      setNewItem('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      attemptAddItem();
      e.preventDefault(); // Prevent potential form submission if wrapped in a form
    }
  };

  const handleAddButtonClick = () => {
    attemptAddItem();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-steelblue-dark">Grocery List</h3>
      <p className="text-sm text-muted-foreground">
        SAY WHAT TO BUY
      </p>
      
      <div className="mt-3">
        <div className="flex items-center border border-steelblue/20 rounded-md focus-within:ring-1 focus-within:ring-steelblue focus-within:border-steelblue overflow-hidden pr-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add grocery item"
            className="flex-1 py-2 px-3 outline-none bg-transparent text-foreground placeholder-muted-foreground/70"
          />
          <button
            onClick={handleAddButtonClick}
            disabled={!newItem.trim()}
            className="px-3 py-2 bg-steelblue text-white hover:bg-steelblue-dark focus:outline-none focus:ring-1 focus:ring-steelblue disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 flex items-center justify-center"
            aria-label="Add grocery item"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
        
        <ul className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
          {groceryItems.length === 0 ? (
            <li className="text-muted-foreground italic text-sm">No items added yet</li>
          ) : (
            groceryItems.map((item, index) => (
              <li 
                key={index} 
                className="flex items-center gap-2 py-2 px-3 bg-accent/50 rounded-md group"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-steelblue flex-shrink-0"></span>
                <span className="flex-1">{item}</span>
                <button
                  onClick={() => onRemoveItem(index)}
                  className="text-steelblue-dark opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove item"
                >
                  ×
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default GroceryList;
