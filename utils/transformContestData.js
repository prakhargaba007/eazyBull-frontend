// utils/transformContestData.js
export const transformContestData = (contest) => {
  return {
    id: contest?._id,
    title: contest?.title,
    prizePool: contest?.prizePool?.toLocaleString() || "0",
    firstPrize: Math.floor(contest?.prizePool * 0.3)?.toLocaleString() || "0",
    spotsLeft: contest?.maxParticipants - contest?.currentParticipants || 0,
    totalSpots: contest?.maxParticipants || 0,
    maxWinners: Math.floor(contest?.maxParticipants * 0.2) || 0,
    winPercentage: Math.floor(
      (contest?.currentParticipants / contest?.maxParticipants) * 100 || 0
    ),
    discountPrice: contest?.discountEntryFee || 0,
    originalEntryFee: contest?.originalEntryFee || 0,
    status: contest?.status || "N/A",
    participants: contest?.participants || [],
    startTime: contest?.startTime || null,
    endTime: contest?.endTime || null,
    description: contest?.description || "No description available",
    compitionId: contest?._id || null,
    instrumentName: contest?.instrument?.symbolName,
  };
};
