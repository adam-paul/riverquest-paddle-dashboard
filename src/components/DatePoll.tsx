
import React from 'react';
import { cn } from '@/lib/utils';

interface DatePollProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
}

const DatePoll = ({ selectedDate, onDateSelect }: DatePollProps) => {
  const dateOptions = [
    { id: 'july-7', label: 'July 7th', value: 'July 7, 2025' },
    { id: 'july-8', label: 'July 8th', value: 'July 8, 2025' }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-steelblue-dark">Launch Date Preference</h3>
      <p className="text-sm text-muted-foreground">
        PICK A LAUNCH DATE
      </p>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        {dateOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => onDateSelect(option.value)}
            className={cn(
              "px-4 py-3 border rounded-md text-center transition-colors",
              selectedDate === option.value
                ? "bg-steelblue text-white border-steelblue"
                : "bg-white text-foreground border-steelblue/20 hover:bg-accent"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DatePoll;
