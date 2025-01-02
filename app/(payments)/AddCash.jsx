import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import RazorpayCheckout from "react-native-razorpay";

const AddCash = () => {
  const router = useRouter();
  const [amount, setAmount] = useState(80);
  const [selectedAmount, setSelectedAmount] = useState(80);
  const [transactionId, setTransactionId] = useState(null);

  const handleSelectAmount = (value) => {
    setAmount(value);
    setSelectedAmount(value);
  };
  const handlePaymentProcess = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      // First API call to verify transaction
      const verifyResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/transactions/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            type: "Deposit",
            amount: amount * 100,
          }),
        }
      );
      console.log(verifyResponse);

      if (!verifyResponse.ok) {
        throw new Error(`Verification failed: ${verifyResponse.status}`);
      }

      const data = await verifyResponse.json();
      console.log("data", data);
      setTransactionId(data.transaction._id);

      // Configure Razorpay options
      const razorpayOptions = {
        description: "Adding money to wallet",
        image: "https://i.imgur.com/3g7nmJC.png",
        currency: data.order.currency,
        key: process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        order_id: data.order.id,
        name: "eazyBull",
        prefill: {
          email: "void@razorpay.com",
          contact: "9191919191",
          name: "Razorpay Software",
        },
        theme: { color: "#F37254" },
      };

      // Initialize Razorpay payment
      const paymentResult = await RazorpayCheckout.open(razorpayOptions);

      console.log("paymentResult", paymentResult);

      // On successful payment
      const successResponse = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/transactions/initiate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...paymentResult,
            transactionId: data.transaction._id,
          }),
        }
      );
      console.log(successResponse);

      if (!successResponse.ok) {
        throw new Error("Failed to confirm successful payment with server");
      }

      Alert.alert(
        "Payment Successful",
        `Payment ID: ${paymentResult.razorpay_payment_id}`
      );
    } catch (error) {
      console.error("Payment Error:", error);
      const token = await AsyncStorage.getItem("token");

      // Handle payment failure
      try {
        const failureResponse = await fetch(
          `${process.env.EXPO_PUBLIC_SERVER}/transactions/fail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              transactionId: transactionId,
            }),
          }
        );

        if (!failureResponse.ok) {
          console.error(
            "Failed to log payment failure:",
            failureResponse.status
          );
        }
      } catch (failureError) {
        console.error("Error logging payment failure:", failureError);
      }

      Alert.alert(
        "Payment Failed",
        error.description || "Something went wrong. Please try again later."
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <View style={styles.amountButtonsContainer}>
          <TouchableOpacity
            style={[
              styles.amountButton,
              selectedAmount === 80 && styles.selectedButton,
            ]}
            onPress={() => handleSelectAmount(80)}
          >
            <Text style={styles.amountText}>₹80</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.amountButton,
              selectedAmount === 50 && styles.selectedButton,
            ]}
            onPress={() => handleSelectAmount(50)}
          >
            <Text style={styles.amountText}>₹50</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.amountButton,
              selectedAmount === 100 && styles.selectedButton,
            ]}
            onPress={() => handleSelectAmount(100)}
          >
            <Text style={styles.amountText}>₹100</Text>
          </TouchableOpacity>
        </View>

        {/* Enter Amount Section */}
        <View style={styles.enterAmountContainer}>
          <View>
            <Text style={styles.enterAmountLabel}>Enter Amount</Text>
            <TextInput
              style={styles.amountInput}
              keyboardType="numeric"
              value={amount.toString()}
              onChangeText={(text) => {
                setAmount(parseInt(text) || 0);
                setSelectedAmount(parseInt(text));
              }}
            />
          </View>
          <Text style={styles.depositText}>Includes Deposit & GST</Text>
        </View>
      </View>
      <View style={styles.next}>
        <View style={styles.secureContainer}>
          <Text style={styles.secureText}>🔒 100% SECURE</Text>
        </View>
        <TouchableOpacity
          style={[
            styles.nextButton,
            amount >= 39 ? styles.nextButtonEnabled : styles.nextButtonDisabled,
          ]}
          disabled={amount < 39}
          // onPress={() => router.push("/PaymentOption")}
          onPress={handlePaymentProcess}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default AddCash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  amountButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  amountButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  selectedButton: {
    borderColor: "green",
    borderWidth: 2,
  },
  amountText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  enterAmountContainer: {
    marginBottom: 30,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  enterAmountLabel: {
    fontSize: 16,
    marginBottom: 10,
  },
  amountInput: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    fontSize: 24,
    paddingBottom: 5,
    marginBottom: 10,
    width: 150,
  },
  depositText: {
    color: "#1E90FF",
    fontSize: 12,
    marginBottom: 10,
  },
  next: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    marginTop: 30,
    // borderRadius: 100,

    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -5 }, // For top shadow, use negative height
    shadowOpacity: 0.2,
    shadowRadius: 3,

    // Add elevation for Android
    elevation: 10,
  },
  nextButton: {
    paddingVertical: 15,
    padding: 54,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonEnabled: {
    backgroundColor: "green",
  },
  nextButtonDisabled: {
    backgroundColor: "#ccc",
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secureContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  secureText: {
    fontSize: 16,
    color: "#1E90FF",
  },
});
