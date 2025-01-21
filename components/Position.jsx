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
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const Position = ({ tradeId }) => {
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
      <View style={styles.summaryContainer}>
        <View style={styles.fundsRow}>
          <Text style={styles.fundsText}>
            Total Funds -
            <Text style={{ fontWeight: 500, color: "#000" }}>
              ${trade.totalBalance.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.fundsText}>
            Funds used -{" "}
            <Text style={{ fontWeight: 500, color: "#000" }}>
              ${(trade.totalBalance - trade.remainingBalance).toFixed(2)}
            </Text>
          </Text>
        </View>

        <Text style={styles.totalPnlText}>
          Total P&L{" "}
          <Text style={{ fontWeight: 700, color: "#000" }}>
            ${trade.profitLoss.toFixed(2)}
          </Text>
        </Text>
        <View style={styles.pnlCards}>
          <View style={styles.pnlCard}>
            <Text style={styles.pnlLabel}>Realized P&L</Text>
            <Text style={styles.pnlValue}>
              $ {(trade.realizedPnL || 0).toFixed(2)}
            </Text>
          </View>

          {/* Vertical divider */}
          <View style={styles.divider} />

          <View style={styles.pnlCard}>
            <Text style={styles.pnlLabel}>Unrealized P&L</Text>
            <Text style={styles.pnlValue}>
              $ {(trade.unrealizedPnL || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={trade.position}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.tradeItem}>
            <View style={styles.tradeHeader}>
              <View style={styles.symbolContainer}>
                <View style={styles.x}>
                  <Text style={styles.symbolText}>BTCUSD</Text>
                  <Text
                    style={[
                      styles.tradeType,
                      item.tradeType === "BUY"
                        ? styles.buyText
                        : styles.sellText,
                    ]}
                  >
                    {item.tradeType} {item.quantity.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.priceRange}>
                  {item.openPrice.toFixed(2)} → {item.openPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <Text style={styles.quantityText}>
                  {item.openPrice.toFixed(2)}
                </Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => {
                    /* Handle close */
                  }}
                >
                  <MaterialIcons name="close" size={16} color="#881b20" />
                </TouchableOpacity>
              </View>
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
    backgroundColor: "#f5f5f5",
  },
  summaryContainer: {
    backgroundColor: "#F4EAEB",
    padding: 16,
    marginBottom: 76,
    height: "23%",
  },
  x: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    textTransform: "capitalize",
  },
  fundsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fundsText: {
    fontSize: 14,
    color: "#333",
  },
  totalPnlText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
  },
  pnlCards: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    // borderRadius: 6, // Enhanced for a smoother look
    overflow: "hidden", // Ensures child elements respect the border radius
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    backgroundColor: "#fff", // Add background for clarity
  },
  pnlCard: {
    borderRadius: 0, // Removed border radius to align within parent
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 36,
    paddingHorizontal: 20,
  },
  divider: {
    width: 2, // Thin vertical line
    backgroundColor: "#ddd", // Light gray for subtle separation
    marginVertical: 12, // Matches padding for a seamless look
  },
  pnlLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  pnlValue: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },

  listContainer: {
    // padding: 16,
  },
  tradeItem: {
    backgroundColor: "#fff",
    // borderRadius: 8,
    padding: 12,
    marginBottom: 2,
    // borderBlockColor: "#000",
    // borderWidth: 2,
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
  },
  symbolContainer: {
    flex: 1,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  tradeType: {
    fontSize: 14,
    marginBottom: 4,
  },
  buyText: {
    color: "#22c55e",
    textTransform: "uppercase",
  },
  sellText: {
    color: "#ef4444",
  },
  priceRange: {
    fontSize: 14,
    color: "#666",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  quantityText: {
    fontSize: 20,
    color: "#007aff",
    fontWeight: "700",
  },
  closeButton: {
    padding: 4,
    borderColor: "#881b20",
    borderWidth: 1,
    borderRadius: 10,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 24,
  },
});

export default Position;
