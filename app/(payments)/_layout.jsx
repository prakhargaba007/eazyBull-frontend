import { StatusBar } from "react-native";
import React from "react";
import { Stack, Slot } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fc4100",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "400",
          },
        }}
      >
        <Stack.Screen
          name="wallet"
          options={{
            // headerShown: false,
            title: "My Wallet",
          }}
        />
        <Stack.Screen
          name="AddCash"
          options={{
            // headerShown: false,
            title: "Choose Amount",
          }}
        />
        <Stack.Screen
          name="PaymentOption"
          options={{
            // headerShown: false,
            title: "Select Payment Option",
          }}
        />
        <Stack.Screen
          name="TransactionHistory"
          options={{
            title: "Transaction History",
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#fc4100" barStyle={"light-content"} />
    </>
  );
};

export default AuthLayout;
