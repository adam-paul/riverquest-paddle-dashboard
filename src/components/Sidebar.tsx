import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  participants: { id: string; name: string }[];
  activeParticipant: string;
  setActiveParticipant: (id: string) => void;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar = ({ 
  participants, 
  activeParticipant, 
  setActiveParticipant,
  isSidebarOpen,
  toggleSidebar,
  isMobile
}: SidebarProps) => {
  return (
    <div className="relative">
      {/* Toggle button for mobile */}
      <button 
        className={cn(
          "md:hidden fixed top-16 z-40 p-2 bg-steelblue text-white transition-all duration-300 ease-in-out",
          isSidebarOpen ? "left-64 -translate-x-full rounded-l-md" : "left-0 rounded-r-md"
        )}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen ? "←" : "→"}
      </button>
      
      <aside 
        className={cn(
          "w-64 border-r border-steelblue/20 bg-white transition-all duration-300 ease-in-out",
          isMobile ? 
            `fixed left-0 top-16 bottom-0 z-30 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}` :
            "h-full md:translate-x-0" // For desktop: in-flow, full height, ensure visible
        )}
      >
        <div className="p-4 border-b border-steelblue/20">
          <h2 className="text-lg font-medium text-steelblue">Participants</h2>
        </div>
        <nav className="py-2">
          <ul className="space-y-1">
            {participants.map((participant) => (
              <li key={participant.id}>
                <button
                  onClick={() => setActiveParticipant(participant.id)}
                  className={cn(
                    "w-full text-left px-4 py-2 hover:bg-accent transition-colors",
                    activeParticipant === participant.id 
                      ? "bg-steelblue text-white" 
                      : "text-foreground"
                  )}
                >
                  {participant.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </div>
  );
};

export default Sidebar;
