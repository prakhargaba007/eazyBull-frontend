import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

const BitcoinPriceCard = ({ data, priceColor }) => {
  const currentPrice = Number(data.price);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.leftContent}>
          <View style={styles.x}>
            <Image
              source={{ uri: `${process.env.EXPO_PUBLIC_SERVER}${data.logo}` }}
              style={{ height: 40, width: 40 }}
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

        <TouchableOpacity
          onPress={() => {
            router.push({
              pathname: "/Charts/chartss",
              params: {
                symbolId: data?.symbol,
                title: data?.title,
              },
            });
          }}
          style={styles.rightContent}
        >
          <Text style={styles.btcText}>{data.symbolName}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.y}>
        <View style={styles.z}></View>
        <Text style={[styles.priceText, { color: priceColor }]}>
          ${currentPrice.toFixed(2)}
        </Text>
      </View>

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
  },
  timeContainer: {
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
    marginLeft: 8,
    marginRight: 15,
  },
  badge: {
    backgroundColor: "#FFF5E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginHorizontal: 10,
    marginBottom: 10,
  },
  badgeText: {
    color: "#333",
    fontSize: 12,
  },
});

export default BitcoinPriceCard;
