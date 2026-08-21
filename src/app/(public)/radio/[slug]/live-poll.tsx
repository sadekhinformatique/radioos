"use client";

import { useState } from "react";
import { useRealtimePolls, type RealtimePoll } from "@/hooks/use-realtime-polls";
import { BarChart3, Check, Users, Clock } from "lucide-react";

interface LivePollProps {
  radioId: string;
}

export function LivePoll({ radioId }: LivePollProps) {
  const { activePoll, vote, hasVoted, voteAnimation } = useRealtimePolls(radioId);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);

  if (!activePoll) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">Sondage en direct</h3>
        </div>
        <div className="text-center py-8 text-gray-400">
          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Aucun sondage actif</p>
          <p className="text-xs mt-1">Revenez plus tard !</p>
        </div>
      </div>
    );
  }

  const handleVote = () => {
    if (selectedOption === null) return;
    const success = vote(activePoll.id, selectedOption);
    if (success) {
      setShowResults(true);
    }
  };

  const userVoted = hasVoted(activePoll.id) || showResults;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <span className="font-semibold">Sondage en direct</span>
          </div>
          {activePoll.expiresAt && (
            <div className="flex items-center gap-1 text-sm text-purple-100">
              <Clock className="w-4 h-4" />
              <span>Se termine bientôt</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* Question */}
        <h4 className="text-lg font-semibold text-gray-900 mb-4">{activePoll.question}</h4>

        {/* Options */}
        <div className="space-y-3">
          {activePoll.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const percentage = option.percentage || 0;
            const isWinner =
              activePoll.options.every((o) => o.votes <= option.votes) && option.votes > 0;

            return (
              <button
                key={index}
                onClick={() => {
                  if (!userVoted) {
                    setSelectedOption(index);
                  }
                }}
                disabled={userVoted}
                className={`w-full text-left relative overflow-hidden rounded-lg border-2 transition-all ${
                  userVoted
                    ? "cursor-default"
                    : isSelected
                    ? "border-purple-500 bg-purple-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {/* Progress bar */}
                {userVoted && (
                  <div
                    className={`absolute inset-0 transition-all duration-700 ${
                      isWinner ? "bg-purple-100" : "bg-gray-100"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                )}

                <div className="relative px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {userVoted ? (
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isWinner
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {index + 1}
                      </div>
                    ) : (
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-purple-500 bg-purple-500"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-4 h-4 text-white" />}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-900">{option.text}</span>
                    {isWinner && userVoted && (
                      <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">
                        🏆
                      </span>
                    )}
                  </div>
                  {userVoted && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-gray-900">{percentage}%</span>
                      <span className="text-xs text-gray-500">({option.votes})</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Vote Button */}
        {!userVoted && (
          <button
            onClick={handleVote}
            disabled={selectedOption === null}
            className="w-full mt-4 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Voter
          </button>
        )}

        {/* Total votes */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{activePoll.totalVotes} votes</span>
          </div>
          {userVoted && <span className="text-purple-600 font-medium">✓ Vous avez voté</span>}
        </div>
      </div>
    </div>
  );
}
