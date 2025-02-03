import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const ConnectionStatus = ({ connected }) => (
  <View style={styles.connectionStatus}>
    <View
      style={[
        styles.statusDot,
        { backgroundColor: connected ? "#4CAF50" : "#FF5252" },
      ]}
    />
    <Text style={styles.statusText}>{connected ? "Live" : "Offline"}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
  },
  itemLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#881b20",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileButton: {
    padding: 8,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 16,
  },
  walletSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  moneyText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  gameModeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameModeButton: {
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  selectedGameMode: {
    backgroundColor: "#fff0ed",
  },
  gameModeText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  selectedGameModeText: {
    color: "#881b20",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
    // marginBottom: 20,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  tradeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tradeButtonText: {
    fontSize: 14,
    color: "#ffffff",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  connectionStatus: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
});
