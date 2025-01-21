import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const BitcoinPriceCard = ({ data }) => {
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

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>
          Bullet {"{"}15 Minute Tournament{"}"}
        </Text>
        <Ionicons
          name="information-circle-outline"
          size={24}
          color="#999"
          style={styles.infoIcon}
        />
      </View> */}

      {/* Main Content */}
      <View style={styles.content}>
        <View style={styles.leftContent}>
          {/* Bitcoin Logo */}
          <View style={styles.x}>
            {/* <View style={styles.bitcoinLogo}>
              <Text style={styles.bitcoinSymbol}>₿</Text>
            </View> */}
            <MaterialCommunityIcons
              name={itemIcons[data.title] || "help-circle"}
              size={50}
              //   color="#333"
              style={styles.itemIcon}
            />
            <Text style={styles.bitcoinText}>{data.title}</Text>
          </View>
        </View>
        <View style={styles.textContainer}>
          <View style={styles.timeContainer}>
            <Text style={styles.startsInText}>Starts in</Text>
            <Text style={styles.timeText}>15:00</Text>
          </View>
        </View>

        {/* Right Content */}
        <View style={styles.rightContent}>
          <Text style={styles.btcText}>BTC</Text>
          {/* <Text style={styles.priceText}>$97,944.28</Text> 
          <Text style={styles.percentageText}>0.37% (1d)</Text> */}
        </View>
      </View>
      <View style={styles.y}>
        <View style={styles.z}></View>
        <Text style={styles.priceText}>$97,944.28</Text>
      </View>

      {/* Badge */}
      <View style={styles.badge}>
        <Text style={styles.badgeText}>Mega Rs.44 Lakhs +</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  headerText: {
    fontSize: 14,
    color: "#333",
  },
  infoIcon: {
    position: "absolute",
    right: 0,
    padding: 5,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bitcoinLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#F7931A",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bitcoinSymbol: {
    color: "white",
    fontSize: 24,
  },
  textContainer: {
    justifyContent: "center",
  },
  bitcoinText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  x: {
    display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  timeContainer: {
    // flexDirection: "row",
    alignItems: "center",
  },
  startsInText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  timeText: {
    fontSize: 14,
    color: "#E53935",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  btcText: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 4,
    marginRight: 28,
    borderBottomColor: "gray",
    borderBottomWidth: 2,
    borderRadius: 2,
  },
  y: {
    flexDirection: "row",
    alignItems: "center",
  },
  z: {
    flex: 1,
    height: 3,
    backgroundColor: "#881b20",
    borderRadius: 50,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 4,
    marginLeft: 8,
    marginRight: 15,
  },
  percentageText: {
    fontSize: 14,
    color: "#666",
  },
  badge: {
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    // marginTop: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    // marginTop: 5,
  },
  badgeText: {
    color: "#333",
    fontSize: 12,
  },
});

export default BitcoinPriceCard;
