import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import Entypo from "@expo/vector-icons/Entypo";

const Wallet = ({ money, icon, isDisable, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      disabled={isDisable}
    >
      <View style={styles.walletSection}>
        {icon ? icon : <Entypo name="wallet" size={24} color="white" />}
        <Text style={styles.moneyText}>
          ₹{money?.toLocaleString("en-IN") || "0"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  walletSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  moneyText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
