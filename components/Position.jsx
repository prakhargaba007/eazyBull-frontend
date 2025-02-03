import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  SectionList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import axios from "axios";

const Position = ({ tradeId, onTradeUpdated, instruments, loading, color }) => {
  const [trade, setTrade] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [exitLoading, setExitLoading] = useState({});
  const currentPrice = Number(instruments.price);
  // console.log("instruments", currentPrice);

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

  async function exitPosition(positionId) {
    console.log("positionId", positionId);
    console.log("currentPrice", currentPrice);

    setExitLoading((prev) => ({ ...prev, [positionId]: true }));
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token || !tradeId) {
        throw new Error("No token or tradeId found");
      }

      const position = trade.position.find((p) => p._id === positionId);
      // const currentPrice = await getCurrentMarketPrice(position.tradeType);
      console.log("currentPrice", currentPrice);

      const { data } = await axios.put(
        `${process.env.EXPO_PUBLIC_SERVER}/trades/close`,
        {
          positionId,
          tradeId,
          contestId: trade.contest._id,
          exitPrice: currentPrice,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTrade((prevTrade) => ({
        ...prevTrade,
        position: prevTrade.position.map((pos) =>
          pos._id === positionId
            ? { ...pos, isOpen: false, closedPrice: currentPrice }
            : pos
        ),
        totalBalance: data.trade.totalBalance,
        profitLoss: data.trade.profitLoss,
      }));

      if (onTradeUpdated) {
        onTradeUpdated(data.trade);
      }

      Alert.alert("Success", "Position closed successfully");
    } catch (error) {
      console.error("Error exiting position:", error);
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to close position"
      );
    } finally {
      setExitLoading((prev) => ({ ...prev, [positionId]: false }));
    }
  }

  async function getCurrentMarketPrice(tradeType) {
    // Placeholder for market price API
    return tradeType === "buy" ? currentPrice : currentPrice;
  }

  function handleRefresh() {
    setIsRefreshing(true);
    getTrade().finally(() => setIsRefreshing(false));
  }

  const renderPositionItem = ({ item }) => {
    const isExitLoading = exitLoading[item._id];
    const profitLoss =
      (item.tradeType === "buy"
        ? currentPrice - item.openPrice
        : item.openPrice - currentPrice) * item.quantity;

    const priceColor =
      item.tradeType === "buy"
        ? profitLoss >= 0
          ? "#19db00"
          : "#ef4444"
        : profitLoss >= 0
          ? "#19db00"
          : "#ef4444";
    return (
      <View style={styles.tradeItem}>
        <View style={styles.tradeHeader}>
          <View style={styles.symbolContainer}>
            <View style={styles.x}>
              <Text style={styles.symbolText}>BTCUSD</Text>
              <Text
                style={[
                  styles.tradeType,
                  item.tradeType === "buy" ? styles.buyText : styles.sellText,
                ]}
              >
                {item.tradeType.toUpperCase()} {item.quantity.toFixed(2)}
              </Text>
            </View>
            <View style={styles.tradeDetails}>
              <Text style={styles.priceRange}>
                Entry: {item.openPrice.toFixed(2)}
                {!item.isOpen && ` | Exit: ${item.closedPrice.toFixed(2)}`}
              </Text>
              <View style={styles.targetStopContainer}>
                <Text style={styles.targetStopText}>
                  Target: {item.target ? item.target.toFixed(2) : "N/A"}
                </Text>
                <Text style={styles.targetStopText}>
                  Stop Loss: {item.stopLoss ? item.stopLoss.toFixed(2) : "N/A"}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.quantityContainer}>
            <Text style={[styles.quantityText, { color: priceColor }]}>
              {
                item.isOpen
                  ? profitLoss.toFixed(2) // Show current P/L for open positions
                  : (
                      (item.closedPrice - item.openPrice) *
                      item.quantity
                    ).toFixed(2) // Show final P/L for closed positions
              }
            </Text>
            {item.isOpen && (
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => exitPosition(item._id)}
                disabled={isExitLoading}
              >
                {isExitLoading ? (
                  <ActivityIndicator size="small" color="#881b20" />
                ) : (
                  <MaterialIcons name="close" size={16} color="#881b20" />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (!trade) {
    return (
      <View style={styles.container}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#881b20" />
        ) : (
          <Text style={styles.noDataText}>No trade data available</Text>
        )}
      </View>
    );
  }

  const sections = [
    {
      title: "Open Positions",
      data: trade.position.filter((p) => p.isOpen),
    },
    {
      title: "Closed Positions",
      data: trade.position.filter((p) => !p.isOpen),
    },
  ];

  let unrealisd = trade.position
    .filter((p) => p.isOpen)
    .reduce((total, position) => {
      const pnl =
        position.tradeType === "buy"
          ? (currentPrice - position.openPrice) * position.quantity
          : (position.openPrice - currentPrice) * position.quantity;
      return total + pnl;
    }, 0);

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <View style={styles.fundsRow}>
          <Text style={styles.fundsText}>
            Total Funds:{" "}
            <Text style={{ fontWeight: 500, color: "#000" }}>
              ${trade.totalBalance.toFixed(2)}
            </Text>
          </Text>
          <Text style={styles.fundsText}>
            Funds used -{" "}
            <Text style={{ fontWeight: 500, color: "#000" }}>
              ${(trade.contest.balanceGiven - trade.totalBalance).toFixed(2)}
            </Text>
          </Text>
        </View>

        <Text style={styles.totalPnlText}>
          Total P&L{" "}
          <Text
            style={{
              fontWeight: 700,
              color: trade.profitLoss + unrealisd > 0 ? "#19db00" : "#ef4444",
            }}
          >
            ${(trade.profitLoss + unrealisd).toFixed(2)}
          </Text>
        </Text>
        <View style={styles.pnlCards}>
          <View style={styles.pnlCard}>
            <Text style={styles.pnlLabel}>Realized P&L</Text>
            <Text
              style={[
                styles.pnlValue,
                { color: trade.profitLoss > 0 ? "#19db00" : "#ef4444" },
              ]}
            >
              $ {(trade.profitLoss || 0).toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.pnlCard}>
            <Text style={styles.pnlLabel}>Unrealized P&L</Text>
            <Text
              style={[
                styles.pnlValue,
                { color: unrealisd > 0 ? "#19db00" : "#ef4444" },
              ]}
            >
              $ {(unrealisd || 0).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item._id}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        renderItem={renderPositionItem}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.noPositionsContainer}>
            <Text style={styles.noPositionsText}>No positions found</Text>
          </View>
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
  summaryContainer: {
    backgroundColor: "#F4EAEB",
    padding: 16,
    marginBottom: 60,
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
  noPositionsContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  noPositionsText: {
    fontSize: 16,
    color: "#666",
  },
  sectionHeader: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  tradeDetails: {
    marginTop: 5,
  },
  targetStopContainer: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: 5,
  },
  targetStopText: {
    fontSize: 12,
    color: "#666",
    marginRight: 25,
    minWidth: 100,
  },
});

export default Position;
