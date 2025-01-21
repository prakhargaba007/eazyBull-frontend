import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import moment from "moment";
import { router } from "expo-router";
import { EvilIcons } from "@expo/vector-icons";
import { images } from "../assets/images/assets";

const formatTimeLeft = (duration) => {
  const hours = Math.floor(duration.asHours());
  const minutes = Math.floor(duration.asMinutes() % 60);
  const seconds = Math.floor(duration.asSeconds() % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds).padStart(2, "0")}`;
};

const formatNumber = (num) => {
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + " Lakhs";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "k";
  }
  return num.toString();
};

const ContestCard = ({ item, onEnter, isJoined, isPortfolio }) => {
  // console.log("item", item);

  const [timeLeft, setTimeLeft] = useState("");
  const [contestStatus, setContestStatus] = useState("upcoming");
  const [startTimeFormatted, setStartTimeFormatted] = useState("");

  useEffect(() => {
    // Format start time
    const formattedTime = moment(item.startTime).format("h:mm A");
    setStartTimeFormatted(`Today at ${formattedTime}`);

    const timer = setInterval(() => {
      const now = moment();
      const start = moment(item.startTime);
      const end = moment(item.endTime);
      const differenceToStart = start.diff(now);
      const differenceToEnd = end.diff(now);

      // Update contest status
      if (differenceToStart > 0) {
        // console.log(1);
        setContestStatus("upcoming");
        const duration = moment.duration(differenceToStart);
        setTimeLeft(formatTimeLeft(duration));
      } else if (differenceToStart <= 0 && differenceToEnd > 0) {
        // console.log(2);
        const duration = moment.duration(differenceToEnd);
        setTimeLeft(formatTimeLeft(duration));
        setContestStatus("ongoing");
        // setTimeLeft("Started");
      } else {
        // console.log(3);
        setContestStatus("ended");
        setTimeLeft("View Result");
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [item.startTime, item.endTime]);

  const handleStartTrade = () => {
    router.push({
      pathname: "main",
      params: {
        contestId: item.compitionId,
        tradeId: item.tradeId,
      },
    });
  };

  const renderActionButton = () => {
    if (isJoined) {
      // console.log(1, contestStatus);
      if (contestStatus === "ongoing") {
        // console.log(2, contestStatus);
        return (
          <TouchableOpacity
            style={[styles.entryButton, styles.tradingButton]}
            onPress={handleStartTrade}
          >
            <Text style={styles.entryButtonText}>Trade</Text>
          </TouchableOpacity>
        );
      }
      return (
        <View style={[styles.entryButton, styles.joinedButton]}>
          <Text style={styles.entryButtonText}>
            {contestStatus === "ended" ? "Ended" : "Joined"}
          </Text>
        </View>
      );
    }

    if (contestStatus !== "upcoming") {
      // console.log(contestStatus);

      return (
        <View style={[styles.entryButton, styles.disabledButton]}>
          <Text style={styles.entryButtonText}>
            {contestStatus === "ended" ? "Ended" : "Started"}
          </Text>
        </View>
      );
    }

    return (
      <TouchableOpacity style={styles.entryButton} onPress={onEnter}>
        <Text style={styles.entryButtonText}>₹{item.discountPrice}</Text>
      </TouchableOpacity>
    );
  };

  if (item.spotsLeft === 0 && !item.isJoined) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.x}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <View style={styles.titleBadge}>
              <Text style={styles.titleText}>{item.title}</Text>
            </View>
          </View>
          <Text style={styles.startTimeText}>Starts: {startTimeFormatted}</Text>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.prizeContainer}>
            <Text style={styles.prizeText}>
              ₹
              {typeof prizePool === "number"
                ? formatNumber(item.prizePool)
                : item.prizePool}
            </Text>
          </View>

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>
              {contestStatus === "upcoming"
                ? "Starts in"
                : contestStatus === "ongoing"
                ? "Ends in"
                : "Completed"}
            </Text>
            <Text style={styles.timerValue}>{timeLeft}</Text>
          </View>

          {renderActionButton()}
        </View>
        {!isPortfolio && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${(item.spotsLeft / item.totalSpots) * 100}%` },
                ]}
              />
            </View>
            <View style={styles.spotsContainer}>
              <Text style={styles.spotsText}>{item.spotsLeft} Left</Text>
              <Text style={styles.spotsText}>{item.totalSpots} Spots</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Image source={images.medal} style={styles.firstLogo} />
          <Text style={styles.prizeAmount}>
            ₹
            {typeof firstPrize === "number"
              ? formatNumber(item.firstPrize)
              : item.firstPrize}
          </Text>
        </View>
        <View style={styles.trophyIcon}>
          <EvilIcons name="trophy" size={24} color="black" />
          <Text style={styles.percentageText}>{item.winPercentage}%</Text>
        </View>
        <View style={styles.maxWinnersContainer}>
          <View style={styles.maxWinnersIcon}>
            <Text style={styles.maxWinnersIconText}>M</Text>
          </View>
          <Text style={styles.maxWinnersText}>Upto {item.maxWinners}</Text>
        </View>
        <View style={styles.trophyIcon}>
          <EvilIcons name="trophy" size={24} color="black" />
          <Text style={styles.percentageText}>
            {isPortfolio && item.instrumentName}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    // paddingVertical: 12,
    paddingTop: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
  },
  x: {
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
  },
  titleBadge: {
    backgroundColor: "#881b20",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  titleText: {
    color: "white",
    fontWeight: "600",
  },
  startTimeText: {
    color: "#666",
    fontSize: 12,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  prizeContainer: {
    flex: 1,
  },
  prizeText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  timerContainer: {
    alignItems: "center",
    flex: 1,
    marginRight: 15,
  },
  timerLabel: {
    color: "#666",
    fontSize: 12,
  },
  timerValue: {
    color: "#881b20",
    fontWeight: "600",
    fontSize: 16,
  },
  entryButton: {
    backgroundColor: "#008936",
    // paddingHorizontal: 32,
    width: 90,
    paddingVertical: 8,
    borderRadius: 8,
  },
  tradingButton: {
    backgroundColor: "#2196F3",
  },
  joinedButton: {
    backgroundColor: "#666",
  },
  disabledButton: {
    backgroundColor: "#999",
  },
  entryButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  progressContainer: {
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#f0f0f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#881b20",
  },
  spotsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  spotsText: {
    fontSize: 12,
    color: "#666",
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#f8fbff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  footerItem: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  firstLogo: {
    width: 20,
    height: 20,
  },
  prizeAmount: {
    fontWeight: "600",
    marginRight: 4,
  },
  trophyIcon: {
    marginRight: 4,
    flexDirection: "row",
  },
  trophyText: {
    fontSize: 16,
  },
  percentageText: {
    color: "#666",
  },
  maxWinnersContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  maxWinnersIcon: {
    backgroundColor: "#f0f0f0",
    width: 18,
    height: 18,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 4,
    borderColor: "#000",
    borderWidth: 1,
  },
  maxWinnersIconText: {
    fontWeight: "600",
    fontSize: 10,
  },
  maxWinnersText: {
    color: "#666",
    fontSize: 12,
  },
});

export default ContestCard;
