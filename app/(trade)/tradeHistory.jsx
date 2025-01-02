import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const TradeHistory = () => {
  const { tradeId } = useLocalSearchParams();
  const [trade, setTrade] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    getTrade();
  }, [tradeId]);

  async function getTrade() {
    setIsLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token || !tradeId) {
        throw new Error("No token or tradeId found");
      }

      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/trades/history/${tradeId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch trade history");
      }

      const tradeData = await response.json();
      // console.log("tradeData",tradeData);

      setTrade(tradeData);
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  function handleRefresh() {
    setIsRefreshing(true);
    getTrade().finally(() => setIsRefreshing(false));
  }

  if (!trade) {
    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#0066cc" />
        ) : (
          <Text style={styles.noDataText}>No trade data available</Text>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trade Details</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefresh}
          disabled={isRefreshing}
        >
          <Text style={styles.refreshButtonText}>
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.overviewCard}>
        {/* <Text style={styles.label}>
          Trade ID: <Text style={styles.value}>{trade._id}</Text>
        </Text>
        <Text style={styles.label}>
          Contest: <Text style={styles.value}>{trade.contest}</Text>
        </Text> */}
        <Text style={styles.label}>
          Profit/Loss:
          <Text
            style={[
              styles.value,
              parseFloat(trade.profitLoss) >= 0
                ? styles.profitText
                : styles.lossText,
            ]}
          >
            {" "}
            {trade.profitLoss}
          </Text>
        </Text>
        <Text style={styles.label}>
          Total Balance: <Text style={styles.value}>{trade.totalBalance}</Text>
        </Text>
      </View>

      <Text style={styles.subtitle}>Trade History</Text>

      <FlatList
        data={trade.trade.reverse()}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.tradeItem}>
            <View style={styles.tradeHeader}>
              <Text
                style={[
                  styles.tradeType,
                  item.tradeType === "BUY" ? styles.buyText : styles.sellText,
                ]}
              >
                {item.tradeType}
              </Text>
              <Text style={styles.tradeDate}>
                {moment(item.tradeDate).calendar()}
              </Text>
            </View>
            <View style={styles.tradeDivider} />
            <View style={styles.tradeDetails}>
              <Text style={styles.tradeLabel}>
                Price: <Text style={styles.tradeValue}>{item.price}</Text>
              </Text>
              <Text style={styles.tradeLabel}>
                Quantity: <Text style={styles.tradeValue}>{item.quantity}</Text>
              </Text>
              <Text style={styles.tradeLabel}>
                Remaining Balance:{" "}
                <Text style={styles.tradeValue}>{item.remainingBalance}</Text>
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  refreshButton: {
    backgroundColor: "#0066cc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  refreshButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  overviewCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  value: {
    color: "#333",
    fontWeight: "500",
  },
  profitText: {
    color: "#22c55e",
  },
  lossText: {
    color: "#ef4444",
  },
  listContainer: {
    paddingBottom: 16,
  },
  tradeItem: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tradeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  tradeDivider: {
    height: 1,
    backgroundColor: "#e5e5e5",
    marginVertical: 8,
  },
  tradeType: {
    fontWeight: "bold",
    fontSize: 16,
  },
  buyText: {
    color: "#22c55e",
  },
  sellText: {
    color: "#ef4444",
  },
  tradeDate: {
    color: "#666",
    fontSize: 14,
  },
  tradeDetails: {
    marginTop: 8,
  },
  tradeLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  tradeValue: {
    color: "#333",
    fontWeight: "500",
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default TradeHistory;
