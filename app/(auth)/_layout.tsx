import { StatusBar } from "react-native";
import React from "react";
import { Stack, Slot } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="signIn"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="otp"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#7B7B8B" barStyle={"dark-content"} />
    </>
  );
};

export default AuthLayout;
