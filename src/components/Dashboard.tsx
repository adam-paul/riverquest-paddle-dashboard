import React from 'react';
import DatePoll from './DatePoll';
import GroceryList from './GroceryList';

interface DashboardProps {
  participant: { 
    id: string; 
    name: string; 
    selectedDate: string | null;
    groceryList: string[];
  };
  onDateSelect: (date: string) => void;
  onGroceryAdd: (item: string) => void;
  onGroceryRemove: (index: number) => void;
}

const Dashboard = ({ 
  participant, 
  onDateSelect, 
  onGroceryAdd,
  onGroceryRemove 
}: DashboardProps) => {
  return (
    <div className="p-6 space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-steelblue-dark mb-1">
          {participant.name}'s Dashboard
        </h2>
        <p className="text-muted-foreground">
          PICK A LAUNCH DATE AND SAY WHAT TO BUY
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-steelblue/10">
          <DatePoll 
            selectedDate={participant.selectedDate} 
            onDateSelect={onDateSelect}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-steelblue/10">
          <GroceryList 
            groceryItems={participant.groceryList} 
            onAddItem={onGroceryAdd}
            onRemoveItem={onGroceryRemove}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
