import React from 'react';

interface VoteData {
  dates: string[];
  votes: number;
  hasVotes: boolean;
}

interface HeaderProps {
  voteData?: VoteData; // Make it optional in case it's not always passed
}

const Header = ({ voteData }: HeaderProps) => {
  const renderVoteInfo = () => {
    if (!voteData || !voteData.hasVotes) {
      return <span className="text-sm text-gray-500">Launch Date: No votes yet</span>;
    }
    if (voteData.dates.length === 1) {
      return <span className="text-sm text-gray-700">Launch Date: {voteData.dates[0]} ({voteData.votes} votes)</span>;
    }
    return <span className="text-sm text-gray-700">Launch Date: {voteData.dates.length} dates tied ({voteData.votes} votes)</span>;
  };

  return (
    <header className="bg-white shadow-sm border-b border-steelblue/20 h-16">
      <div className="px-6 py-4 flex justify-between items-center h-full">
        <h1 className="text-xl md:text-2xl font-semibold text-steelblue-dark">
          Yukon2kon25 RiverQuest PaddleTrip BoatBash Ltd.™
        </h1>
        <div>
          {renderVoteInfo()}
        </div>
      </div>
    </header>
  );
};

export default Header;
