import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/lib/supabaseClient';

interface Participant {
  id: string;
  name: string;
  selectedDate: string | null;
  groceryList: string[];
}

const Index = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [activeParticipantId, setActiveParticipantId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchParticipants = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: dbError } = await supabase
          .from('participants')
          .select('id, name, selected_date, grocery_list');

        if (dbError) {
          throw dbError;
        }

        if (data) {
          const typedData = data.map(p => ({
            ...p,
            selectedDate: p.selected_date,
            groceryList: p.grocery_list || []
          })) as Participant[];

          const sortedMappedData = [...typedData].sort((a_part, b_part) => {
            const lastNameA = a_part.name.split(' ').pop() || '';
            const lastNameB = b_part.name.split(' ').pop() || '';
            return lastNameA.localeCompare(lastNameB);
          });

          setParticipants(sortedMappedData);
          if (sortedMappedData.length > 0) {
            setActiveParticipantId(sortedMappedData[0].id);
          }
        } else {
          setParticipants([]);
        }
      } catch (err: any) {
        console.error("Error fetching participants:", err);
        setError(err.message || "Failed to fetch participants.");
        setParticipants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  const activeParticipant = activeParticipantId 
    ? participants.find(p => p.id === activeParticipantId) 
    : participants.length > 0 ? participants[0] : null;

  const calculateVoteData = () => {
    if (!participants || participants.length === 0) {
      return { dates: [], votes: 0, hasVotes: false };
    }

    const dateVotes: Record<string, number> = {};
    let hasAnyActualVotes = false;
    participants.forEach(p => {
      if (p.selectedDate) {
        dateVotes[p.selectedDate] = (dateVotes[p.selectedDate] || 0) + 1;
        hasAnyActualVotes = true;
      }
    });

    if (!hasAnyActualVotes) {
      return { dates: [], votes: 0, hasVotes: false };
    }

    let maxVotes = 0;
    for (const date in dateVotes) {
      if (dateVotes[date] > maxVotes) {
        maxVotes = dateVotes[date];
      }
    }

    const leadingDates = Object.keys(dateVotes).filter(
      date => dateVotes[date] === maxVotes
    );

    return { dates: leadingDates, votes: maxVotes, hasVotes: true };
  };

  const voteData = calculateVoteData();

  const handleDateSelect = async (date: string) => {
    if (!activeParticipant) return;

    const oldSelectedDate = activeParticipant.selectedDate;
    const newSelectedDate = oldSelectedDate === date ? null : date;

    // Optimistic update of local state
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === activeParticipantId ? { ...p, selectedDate: newSelectedDate } : p
      )
    );

    try {
      const { error: updateError } = await supabase
        .from('participants')
        .update({ selected_date: newSelectedDate }) // Use DB column name
        .eq('id', activeParticipantId);

      if (updateError) {
        throw updateError;
      }
    } catch (err: any) {
      console.error("Error updating selected date:", err);
      // Revert optimistic update on error
      setParticipants(prevParticipants =>
        prevParticipants.map(p =>
          p.id === activeParticipantId ? { ...p, selectedDate: oldSelectedDate } : p
        )
      );
      // Optionally, notify the user about the error
      alert(`Failed to update date: ${err.message}`);
    }
  };

  const handleAddGroceryItem = async (item: string) => {
    if (!activeParticipant) return;

    const newGroceryList = [...activeParticipant.groceryList, item];

    // Optimistic update
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === activeParticipantId 
          ? { ...p, groceryList: newGroceryList } 
          : p
      )
    );

    try {
      const { error: updateError } = await supabase
        .from('participants')
        .update({ grocery_list: newGroceryList }) // Use DB column name
        .eq('id', activeParticipantId);

      if (updateError) {
        throw updateError;
      }
    } catch (err: any) {
      console.error("Error adding grocery item:", err);
      // Revert optimistic update
      setParticipants(prevParticipants =>
        prevParticipants.map(p =>
          p.id === activeParticipantId 
            ? { ...p, groceryList: activeParticipant.groceryList } // Revert to original list
            : p
        )
      );
      alert(`Failed to add grocery item: ${err.message}`);
    }
  };

  const handleRemoveGroceryItem = async (indexToRemove: number) => {
    if (!activeParticipant) return;

    const originalGroceryList = [...activeParticipant.groceryList];
    const newGroceryList = activeParticipant.groceryList.filter((_, i) => i !== indexToRemove);

    // Optimistic update
    setParticipants(prevParticipants =>
      prevParticipants.map(p =>
        p.id === activeParticipantId 
          ? { ...p, groceryList: newGroceryList }
          : p
      )
    );

    try {
      const { error: updateError } = await supabase
        .from('participants')
        .update({ grocery_list: newGroceryList }) // Use DB column name
        .eq('id', activeParticipantId);

      if (updateError) {
        throw updateError;
      }
    } catch (err: any) {
      console.error("Error removing grocery item:", err);
      // Revert optimistic update
      setParticipants(prevParticipants =>
        prevParticipants.map(p =>
          p.id === activeParticipantId 
            ? { ...p, groceryList: originalGroceryList } // Revert to original list
            : p
        )
      );
      alert(`Failed to remove grocery item: ${err.message}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleParticipantSelect = (id: string) => {
    setActiveParticipantId(id);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  if (loading) return <p>Loading participants...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!activeParticipant) return <p>No participants found or selected.</p>;

  return (
    <div className="min-h-screen flex flex-col bg-eggshell">
      <Header voteData={voteData} />
      <div className="flex flex-1">
        <Sidebar 
          participants={participants} 
          activeParticipant={activeParticipantId}
          setActiveParticipant={handleParticipantSelect}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
        />
        
        <main className={`flex-1 transition-all duration-300 ${isMobile ? 'ml-0 pt-10' : ''}`}>
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
