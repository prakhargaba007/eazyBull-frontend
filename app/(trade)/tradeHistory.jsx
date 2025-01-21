import { StyleSheet } from "react-native";
import React from "react";
import Position from "../../components/Position";
import { useLocalSearchParams } from "expo-router";

const tradeHistory = () => {
  const { tradeId } = useLocalSearchParams();
  return <Position tradeId={tradeId} />;
};

export default tradeHistory;

const styles = StyleSheet.create({});
