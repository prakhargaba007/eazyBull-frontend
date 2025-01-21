import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

const itemIcons = {
  Bitcoin: "bitcoin",
  Ethereum: "ethereum",
  Ripple: "alpha-x-circle",
  Litecoin: "litecoin",
  Gold: "gold",
  Silver: "podium-silver",
  Platinum: "alpha-p-circle",
  Palladium: "alpha-p-box",
  "S&P 500": "chart-bar",
  Nasdaq: "chart-bell-curve",
  "Nikkei 225": "chart-areaspline",
};

const WatchlistItem = ({ item }) => {
  const getColor = (change) => {
    return parseFloat(change) >= 0 ? "#4CAF50" : "#FF5252";
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.leftContent}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons
            name={itemIcons[item.title] || "chart-line"}
            size={24}
            color="#666"
          />
        </View>
        <View style={styles.nameContainer}>
          <Text style={styles.symbolText}>{item.symbolName}</Text>
          <Text style={styles.nameText}>{item.title}</Text>
        </View>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.priceText}>
          $
          {typeof item.price === "number"
            ? item.price
                .toFixed(2)
                .toLocaleString("en-US", { maximumFractionDigits: 2 })
            : item.price}
        </Text>
        {/* <View style={styles.changeContainer}>
          <Text style={[styles.changeText, { color: getColor(item.change) }]}>
            {item.change} {item.changePercentage}%
          </Text>
        </View> */}
      </View>
    </View>
  );
};

const Watchlist = () => {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        const response = await fetch(
          process.env.EXPO_PUBLIC_SERVER + "/instrument"
        );
        const data = await response.json();
        setInstruments(data);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstruments();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Watchlist</Text>
      <FlatList
        data={instruments}
        renderItem={({ item }) => {
          // console.log("item", item);

          return (
            <>
              <TouchableOpacity
                onPress={() => {
                  router.push({
                    pathname: "/Charts/chartss",
                    params: {
                      symbolId: item?.symbol,
                      title: item?.title,
                    },
                  });
                }}
              >
                <WatchlistItem item={item} />
              </TouchableOpacity>
            </>
          );
        }}
        keyExtractor={(item) => item.symbol}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 16,
    color: "#1a1a1a",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  nameContainer: {
    flex: 1,
  },
  symbolText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  nameText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  priceContainer: {
    alignItems: "flex-end",
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  changeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 2,
  },
  changeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  separator: {
    height: 1,
    backgroundColor: "#f0f0f0",
  },
});

export default Watchlist;
