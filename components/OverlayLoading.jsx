import React, { useState } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function OverlayLoading({ loading }) {
  // const [loading, setLoading] = useState(false);

  // // Simulate a long-running task
  // const handleButtonClick = () => {
  //   setLoading(true);
  //   setTimeout(() => {
  //     setLoading(false); // Stop loading after 3 seconds
  //   }, 3000);
  // };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#881b20" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  title: {
    fontSize: 18,
    marginBottom: 20,
  },
  overlay: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
    justifyContent: "center",
    alignItems: "center",
  },
});
