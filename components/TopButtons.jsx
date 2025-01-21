import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";

const TopButtons = ({ selectedMode, setSelectedMode }) => {
  const GameModeButton = ({ mode, icon }) => (
    <TouchableOpacity
      style={[
        styles.gameModeButton,
        selectedMode === mode && styles.selectedGameMode,
      ]}
      onPress={() => {
        setSelectedMode(mode);
        // setTimeLeft(getInitialTime(mode));
      }}
      activeOpacity={0.7}
    >
      <FontAwesome5
        name={icon}
        size={18}
        color={selectedMode === mode ? "#881b20" : "#333"}
      />
      <Text
        style={[
          styles.gameModeText,
          selectedMode === mode && styles.selectedGameModeText,
        ]}
      >
        {mode}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View>
      <View style={styles.gameModeContainer}>
        <GameModeButton mode="Bullet" icon="bolt" />
        <GameModeButton mode="Rapid" icon="tachometer-alt" />
        <GameModeButton mode="Classic" icon="chess" />
      </View>
    </View>
  );
};

export default TopButtons;

const styles = StyleSheet.create({
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
});
