
import React, { useState } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import { useIsMobile } from '@/hooks/use-mobile';

interface Participant {
  id: string;
  name: string;
  selectedDate: string | null;
  groceryList: string[];
}

const Index = () => {
  // Sort participants alphabetically by last name
  const initialParticipants: Participant[] = [
    { id: '1', name: 'Spencer Bialek', selectedDate: null, groceryList: [] },
    { id: '2', name: 'Matt Bowley', selectedDate: null, groceryList: [] },
    { id: '3', name: 'Katelyn Bunn', selectedDate: null, groceryList: [] },
    { id: '4', name: 'Heather Earle', selectedDate: null, groceryList: [] },
    { id: '5', name: 'Grayson Hicks', selectedDate: null, groceryList: [] },
    { id: '6', name: 'Arella Kamp', selectedDate: null, groceryList: [] },
    { id: '7', name: 'Cara Nikolai', selectedDate: null, groceryList: [] },
    { id: '8', name: 'Adam Paul', selectedDate: null, groceryList: [] },
    { id: '9', name: 'Babak Zargarian', selectedDate: null, groceryList: [] },
  ].sort((a, b) => {
    const lastNameA = a.name.split(' ').pop() || '';
    const lastNameB = b.name.split(' ').pop() || '';
    return lastNameA.localeCompare(lastNameB);
  });

  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [activeParticipantId, setActiveParticipantId] = useState<string>(participants[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const isMobile = useIsMobile();

  const activeParticipant = participants.find(p => p.id === activeParticipantId) || participants[0];

  const handleDateSelect = (date: string) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === activeParticipantId ? { ...p, selectedDate: date } : p
      )
    );
  };

  const handleAddGroceryItem = (item: string) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === activeParticipantId 
          ? { ...p, groceryList: [...p.groceryList, item] } 
          : p
      )
    );
  };

  const handleRemoveGroceryItem = (index: number) => {
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === activeParticipantId 
          ? { 
              ...p, 
              groceryList: p.groceryList.filter((_, i) => i !== index) 
            } 
          : p
      )
    );
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // When a participant is selected on mobile, close the sidebar
  const handleParticipantSelect = (id: string) => {
    setActiveParticipantId(id);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-eggshell">
      <Header />
      <div className="flex flex-1">
        <Sidebar 
          participants={participants} 
          activeParticipant={activeParticipantId}
          setActiveParticipant={handleParticipantSelect}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0' : 'md:ml-64'}`}>
          <Dashboard 
            participant={activeParticipant}
            onDateSelect={handleDateSelect}
            onGroceryAdd={handleAddGroceryItem}
            onGroceryRemove={handleRemoveGroceryItem}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
