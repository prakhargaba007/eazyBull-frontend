import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CryptoNewsFeed from "../../components/News";

const Learn = () => {
  return (
    <View style={{ flex: 1 }}>
      <CryptoNewsFeed />
    </View>
  );
};

export default Learn;

const styles = StyleSheet.create({});
