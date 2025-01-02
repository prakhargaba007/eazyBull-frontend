import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const PaymentOption = () => {
  // console.log(
  //   "process.env.RAZORPAY_KEY_ID",
  //   process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID
  // );
  // console.log("process.env.EXPO_PUBLIC_SERVER", process.env.EXPO_PUBLIC_SERVER);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Payment Option</Text>
      <TouchableOpacity
        onPress={() => {
          var options = {
            description: "Credits towards consultation",
            image: "https://i.imgur.com/3g7nmJC.png",
            currency: "INR",
            key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
            amount: "5000",
            name: "foo",
            prefill: {
              email: "void@razorpay.com",
              contact: "9191919191",
              name: "Razorpay Software",
            },
            theme: { color: "#F37254" },
          };
          RazorpayCheckout.open(options)
            .then((data) => {
              Alert.alert(`Success: ${data.razorpay_payment_id}`);
            })
            .catch((error) => {
              Alert.alert(`Error: ${error.code} | ${error.description}`);
            });
        }}
      >
        <Text>CLick</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentOption;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
// import { StyleSheet, Text, View } from "react-native";
// import React from "react";

// const PaymentOption = () => {
//   return (
//     <View>
//       <Text>PaymentOption</Text>
//     </View>
//   );
// };

// export default PaymentOption;

// const styles = StyleSheet.create({});
