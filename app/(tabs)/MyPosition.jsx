import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TabButtons from "../../components/TabButtons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ContestCard from "../../components/ContestCard";
import { transformContestData } from "../../utils/transformContestData";
// import News from "../../components/news";

const MyPosition = () => {
  const [activeTab, setActiveTab] = useState("live");
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchContests = async (status) => {
    try {
      setLoading(true);
      const authToken = await AsyncStorage.getItem("token");
      console.log(authToken);

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/contests/getbytype`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken ? `Bearer ${authToken}` : null,
          },
          body: JSON.stringify({
            status:
              status === "live"
                ? "live"
                : status === "upcoming"
                ? "Upcoming"
                : "Completed",
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch contests");
      }

      const data = await response.json();
      // console.log(data);

      const transformedContests = data.contests.map(transformContestData);
      setContests(transformedContests);
      // console.log("transformedContests", contests);

      setError(null);
    } catch (error) {
      console.log("error", error);

      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchContests(activeTab);
  }, [activeTab]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchContests(activeTab);
  }, [activeTab]);

  const renderItem = ({ item }) => {
    return (
      <ContestCard
        item={item}
        activeTab={activeTab}
        isJoined={true}
        isPortfolio={true}
      />
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>
        {error ? error : `No ${activeTab} contests available`}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TabButtons
        setActiveTab={setActiveTab}
        activeTab={activeTab}
        data={[
          { id: 1, title: "Live", value: "live" },
          { id: 2, title: "Upcoming", value: "upcoming" },
          { id: 3, title: "Completed", value: "completed" },
        ]}
      />
      {/* <CryptoNewsFeed /> */}

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fc4100" />
        </View>
      ) : (
        <FlatList
          data={contests}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#fc4100"]}
              tintColor="#fc4100"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default MyPosition;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 15,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  },
});
