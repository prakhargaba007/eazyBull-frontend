import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import moment from "moment";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTransactions = async () => {
    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/transactions/history`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch transactions history");
      }

      const data = await response.json();

      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50";
      case "Pending":
        return "#FFC107";
      case "Failed":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  const formatAmount = (amount) => {
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const renderTransaction = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.amount}>{formatAmount(item.amount / 100)}</Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.label}>Type:</Text>
        <Text style={styles.value}>{item.type}</Text>
      </View>

      {item.method && (
        <View style={styles.detailsRow}>
          <Text style={styles.label}>Method:</Text>
          <Text style={styles.value}>{item.method}</Text>
        </View>
      )}

      <View style={styles.detailsRow}>
        <Text style={styles.label}>Order ID:</Text>
        <Text style={styles.value}>{item.razorpayOrderId}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>
          {moment(item.createdAt).format("DD MMM YYYY, hh:mm A")}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>
      <FlatList
        data={transactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <Text style={styles.emptyText}>No transactions found</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  amount: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: 80,
    color: "#666",
    fontSize: 14,
  },
  value: {
    flex: 1,
    color: "#333",
    fontSize: 14,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginTop: 24,
  },
});

export default TransactionHistory;
