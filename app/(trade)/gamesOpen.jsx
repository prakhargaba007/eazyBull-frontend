import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import ContestCard from "../../components/ContestCard";
import { router, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
// import moment from
// import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { Ionicons } from "@expo/vector-icons";
import TabButtons from "../../components/TabButtons";
import { transformContestData } from "../../utils/transformContestData";

const ITEMS_PER_PAGE = 10;
const { width } = Dimensions.get("window");
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours > 0 ? `${hours}:` : ""}${minutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const GamesOpen = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  // console.log("userInfo", userInfo.contestHistory[0].contestId);

  // const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState("all");
  const [contests, setContests] = useState([]);
  // console.log("contests", contests);-

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContest, setSelectedContest] = useState(null);
  const [error, setError] = useState(null);
  const [nextGame, setNextGame] = useState(null);
  // console.log("nextGame", nextGame);

  const [timeLeft, setTimeLeft] = useState(0);
  const { instrumentId, competitionType, instrumentName } =
    useLocalSearchParams();

  useEffect(() => {
    fetchContests();
    dispatch(fetchUser());
  }, [instrumentId]);

  const fetchContests = async (pageNum = 1, shouldRefresh = false) => {
    // console.log(
    //   `${process.env.EXPO_PUBLIC_SERVER}/contests/instrument/${instrumentId}?ct=${competitionType}`
    // );
    // console.log("reloaded");

    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem("token");
      // console.log("tokensss", authToken);
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/contests/instrument/${instrumentId}?ct=${competitionType}`,
        {
          method: "GET",
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : null,
          },
        }
      );

      // console.log("response", response);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      // console.log("Raw contest data:", data);

      const transformedContests = data.map(transformContestData);
      // console.log("transformedContests", transformedContests);

      await getTimer(transformedContests);
      // userInfo.

      // if (shouldRefresh) {
      setContests(transformedContests);
      // setContests(data);
      // } else {
      //   setContests((prev) => [...prev, ...transformedContests]);
      // }

      setHasMore(transformedContests.length === ITEMS_PER_PAGE);
      setError(null);
    } catch (error) {
      console.error(error); // Log the full error for debugging

      // Use error.message if it's available; otherwise, provide a default error message
      const errorMessage =
        error?.message || "Failed to load contests. Please try again.";
      setError(errorMessage);

      // Display the alert with a string message
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  };

  function getTimer(contests) {
    if (contests.length > 0) {
      // Find the next game that hasn't started yet
      const nowIST = moment().utcOffset("+05:30"); // Current time in IST
      const upcoming = contests
        .filter((contest) => {
          // Convert contest start time to IST for comparison
          const contestStartIST = moment(contest.startTime).utcOffset("+05:30");
          return contestStartIST.isAfter(nowIST);
        })
        .sort(
          (a, b) =>
            moment(a.startTime).utcOffset("+05:30") -
            moment(b.startTime).utcOffset("+05:30")
        )[0];

      if (upcoming) {
        setNextGame(upcoming);

        // Start the timer
        const timer = setInterval(() => {
          const nowIST = moment().utcOffset("+05:30");
          const startTimeIST = moment(upcoming.startTime).utcOffset("+05:30");
          const timeRemaining = Math.floor(startTimeIST.diff(nowIST) / 1000);

          if (timeRemaining <= 0) {
            clearInterval(timer);
            setTimeLeft(0);
            onRefresh(); // Refresh the contests list
          } else {
            setTimeLeft(timeRemaining);
          }
        }, 1000);

        return () => clearInterval(timer);
      }
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    fetchContests(1, true);
    dispatch(fetchUser());
  }, []);

  const loadMore = () => {
    if (!loadingMore && hasMore && !refreshing) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
      fetchContests(page + 1);
    }
  };

  const handleJoinContest = async (contestId) => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/contests/${contestId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("response", response);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to join contest");
      }

      await onRefresh();
      setModalVisible(false);
      Alert.alert("Success", "Successfully joined the contest!");
    } catch (error) {
      Alert.alert(
        "Error",
        error.message || "Failed to join contest. Please try again."
      );
    }
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#881b20" />
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {error
          ? error
          : activeTab === "my"
          ? `You haven't joined any contests yet in ${instrumentName}(${competitionType})`
          : `No contests available at the moment in ${instrumentName}(${competitionType})`}
      </Text>
      {error && (
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const filteredContests =
    activeTab === "all"
      ? contests
      : contests.filter((contest) =>
          contest.participants.some((p) => p.user === userInfo?._id)
        );

  const renderItem = ({ item }) => {
    // Check if the current user has joined this contest
    const isJoined = item.participants.some((p) => p.user === userInfo?._id);

    return (
      <ContestCard
        item={item}
        isJoined={isJoined}
        onEnter={() => {
          setSelectedContest(item);
          setModalVisible(true);
        }}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#881b20" />
      </View>
    );
  }

  return (
    <View style={[styles.box]}>
      <TabButtons
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        data={[
          { id: 1, title: "All Contests", value: "all" },
          { id: 2, title: "My Contests", value: "my" },
        ]}
      />

      {/* {nextGame && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>
            Next {instrumentName} {competitionType} game starts in
          </Text>
          <Text style={styles.timerCountdown}>{formatTime(timeLeft)}</Text>
        </View>
      )} */}

      <FlatList
        data={filteredContests}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#fc4100"]}
            tintColor="#fc4100"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.title}>Confirmation</Text>
            </View>

            <Text style={styles.amountText}>
              Amount Unutilised + Winnings= 100
            </Text>

            <View style={styles.entryContainer}>
              <Text style={styles.entryLabel}>Entry</Text>
              <Text style={styles.entryAmount}>
                {selectedContest?.discountPrice}
              </Text>
            </View>

            {/* {hasDiscount && ( */}
            <View style={styles.discountContainer}>
              <Text style={styles.discountLabel}>DISCOUNT USING</Text>
              <View style={styles.discountRow}>
                <View style={styles.discountBadge}>
                  <Text style={styles.discountBadgeText}>%</Text>
                </View>
                <Text style={styles.discountText}>Discount Pass</Text>
                <Text style={styles.discountAmount}>-0</Text>
              </View>
            </View>
            {/* )} */}

            <View style={styles.totalContainer}>
              <Text style={styles.toPayLabel}>To Pay</Text>
              <Text style={styles.toPayAmount}>
                {selectedContest?.discountPrice}
              </Text>
            </View>

            <Text style={styles.termsText}>
              I agree with the standard{" "}
              <Text style={{ fontWeight: 800 }}>T&Cs</Text>
            </Text>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinContest(selectedContest?.id)}
            >
              <Text style={styles.joinButtonText}>JOIN CONTEST</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GamesOpen;

const styles = StyleSheet.create({
  box: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 15,
    flexGrow: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: "transparent",
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabButtonText: {
    color: "#881b20",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: "#881b20",
    borderRadius: 1.5,
  },
  timerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    marginHorizontal: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timerText: {
    fontSize: 16,
    color: "#666",
  },
  timerCountdown: {
    fontSize: 24,
    color: "#881b20",
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    minHeight: 200,
  },
  emptyStateText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: "#fc4100",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  entryFeeText: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
  },
  confirmButton: {
    backgroundColor: "#fc4100",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButtonText: {
    color: "white",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
  },
  closeButton: {
    position: "absolute",
    left: -15,
    padding: 15,
  },
  amountText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  entryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  entryLabel: {
    fontSize: 16,
  },
  entryAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  discountContainer: {
    backgroundColor: "#f8fdf9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  discountLabel: {
    color: "#666",
    marginBottom: 8,
  },
  discountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountBadge: {
    backgroundColor: "#4CAF50",
    borderRadius: 4,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  discountBadgeText: {
    color: "white",
    fontWeight: "600",
  },
  discountText: {
    flex: 1,
  },
  discountAmount: {
    fontWeight: "600",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  toPayLabel: {
    fontSize: 16,
  },
  toPayAmount: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 10,
  },
  termsText: {
    color: "#666",
    marginBottom: 20,
  },
  joinButton: {
    backgroundColor: "#008936",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  joinButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
