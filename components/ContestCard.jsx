import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import moment from "moment";
import { router } from "expo-router";

const ContestCard = ({
  title,
  prizePool,
  firstPrize,
  spotsLeft,
  totalSpots,
  maxWinners,
  winPercentage,
  discountPrice,
  originalPrice,
  onEnter,
  isJoined,
  startTime,
  endTime,
  onStartTrade, // New prop for handling trade navigation
  navigation, // Navigation prop for redirecting
  compitionId,
  tradeId,
}) => {
  const [timeLeft, setTimeLeft] = useState("");
  const [startTimeIST, setStartTimeIST] = useState("");
  const [isStartingSoon, setIsStartingSoon] = useState(false);
  const [contestStatus, setContestStatus] = useState("upcoming"); // 'upcoming', 'ongoing', 'ended'

  useEffect(() => {
    // Convert to IST by adding 5 hours and 30 minutes
    const istTime = moment(startTime)
      .utcOffset("+05:30")
      .format("DD MMM, hh:mm A");
    setStartTimeIST(istTime);

    const timer = setInterval(() => {
      const now = moment();
      const start = moment(startTime).utcOffset("+05:30");
      const end = moment(endTime).utcOffset("+05:30");
      const differenceToStart = start.diff(now);
      const differenceToEnd = end.diff(now);

      // Update contest status
      if (differenceToStart > 0) {
        setContestStatus("upcoming");
      } else if (differenceToStart <= 0 && differenceToEnd > 0) {
        setContestStatus("ongoing");
      } else {
        setContestStatus("ended");
      }

      // Timer logic for upcoming contests
      if (differenceToStart <= 0) {
        setTimeLeft("Started");
        setIsStartingSoon(false);
      } else {
        const duration = moment.duration(differenceToStart);
        const totalSeconds = Math.floor(duration.asSeconds());
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        let timeString = "";
        if (hours > 0) {
          timeString = `${hours}h ${minutes}m ${seconds}s`;
        } else if (minutes > 0) {
          timeString = `${minutes}m ${seconds}s`;
        } else {
          timeString = `${seconds}s`;
        }

        setTimeLeft(timeString);
        setIsStartingSoon(differenceToStart <= 30 * 60 * 1000);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime]);

  const handleStartTrade = () => {
    // if (onStartTrade) {
    // onStartTrade();
    router.push({
      pathname: "main",
      params: {
        contestId: compitionId,
        tradeId,
      },
    });
    // }
  };

  const renderActionButton = () => {
    if (isJoined) {
      if (contestStatus === "ongoing") {
        return (
          <TouchableOpacity
            style={[styles.enterButton, styles.startTradeButton]}
            onPress={handleStartTrade}
          >
            <Text style={styles.enterButtonText}>Start Trade</Text>
          </TouchableOpacity>
        );
      }
      return (
        <View style={[styles.enterButton, styles.isJoined]}>
          <Text style={[styles.enterButtonText, styles.noWrap]}>
            {contestStatus === "ended" ? "Contest Ended" : "Joined"}
          </Text>
        </View>
      );
    }

    if (contestStatus !== "upcoming") {
      return (
        <View style={[styles.enterButton, styles.disabledButton]}>
          <Text style={[styles.enterButtonText, styles.noWrap]}>
            {contestStatus === "ended" ? "Contest Ended" : "Started"}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.enterButton} onPress={onEnter}>
        <View style={styles.priceContainer}>
          {discountPrice < originalPrice && (
            <Text style={styles.originalPrice}>₹{originalPrice}</Text>
          )}
          <Text style={styles.enterButtonText}>₹{discountPrice}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (spotsLeft === 0 && !isJoined) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
            {contestStatus === "ended" && (
              <View style={styles.statusBadge}>
                <Text style={styles.statusText} numberOfLines={1}>
                  Ended
                </Text>
              </View>
            )}
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.startTimeText} numberOfLines={1}>
              Starts: {moment(startTime).calendar()}
            </Text>
            <View style={styles.timerContainer}>
              <Text
                style={[
                  styles.timerText,
                  isStartingSoon && styles.timerTextUrgent,
                ]}
                numberOfLines={1}
              >
                ⏰ {timeLeft}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.prizeRow}>
          <Text style={styles.prizePool} numberOfLines={1}>
            ₹{prizePool}
          </Text>
          {renderActionButton()}
        </View>

        <View style={styles.prizeInfo}>
          <Text style={styles.firstPrize} numberOfLines={1}>
            1st Prize: ₹{firstPrize}
          </Text>
        </View>

        <View style={styles.progressBar}>
          <View
            style={[
              styles.progress,
              { width: `${(spotsLeft / totalSpots) * 100}%` },
            ]}
          />
        </View>

        <View style={styles.spotsInfo}>
          <Text numberOfLines={1}>{spotsLeft} spots left</Text>
          <Text numberOfLines={1}>{totalSpots} spots</Text>
        </View>
      </View>

      <View style={styles.additionalInfo}>
        <View style={styles.maxCoin}>
          <View style={styles.coinLogo}>
            <Text>M</Text>
          </View>
          <Text numberOfLines={1}>Upto {maxWinners}</Text>
        </View>
        <Text numberOfLines={1}>🏆 {winPercentage}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 8,
    marginBottom: 16,
    elevation: 3,
    overflow: "hidden",
  },
  card: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    flexWrap: "nowrap",
  },
  titleContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  timeContainer: {
    flex: 0,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#E5B488",
    padding: 3,
    borderRadius: 3,
    color: "#65301D",
    flexShrink: 1,
  },
  statusBadge: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
    flexShrink: 0,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  timerContainer: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  timerText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  timerTextUrgent: {
    color: "#ff3b30",
  },
  startTimeText: {
    fontSize: 12,
    color: "#666",
  },
  prizeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  prizePool: {
    fontSize: 24,
    fontWeight: "bold",
    flexShrink: 1,
  },
  enterButton: {
    backgroundColor: "#00B331",
    padding: 8,
    paddingHorizontal: 16,
    minWidth: 120,
    borderRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  startTradeButton: {
    backgroundColor: "#4CAF50",
  },
  disabledButton: {
    backgroundColor: "#cccccc",
  },
  isJoined: {
    backgroundColor: "gray",
  },
  enterButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  noWrap: {
    flexWrap: "nowrap",
  },
  priceContainer: {
    alignItems: "center",
  },
  originalPrice: {
    color: "white",
    textDecorationLine: "line-through",
    fontSize: 12,
  },
  prizeInfo: {
    marginBottom: 8,
    backgroundColor: "#E8E8E8",
    maxWidth: 150,
    borderRadius: 3,
    padding: 3,
  },
  firstPrize: {
    fontWeight: "bold",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#e0e0e0",
    borderRadius: 2,
    marginBottom: 8,
  },
  progress: {
    height: "100%",
    backgroundColor: "#E5B488",
    borderRadius: 2,
  },
  spotsInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  additionalInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#f9f9f9",
  },
  maxCoin: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  coinLogo: {
    backgroundColor: "#bcbcbc",
    width: 20,
    height: 20,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ContestCard;
