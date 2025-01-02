import { StatusBar } from "react-native";
import React from "react";
import { Stack } from "expo-router";

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
          name="profile"
          options={{
            // title: "My Profile",
            headerShown: false,
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#fc4100" barStyle={"light-content"} />
    </>
  );
};

export default AuthLayout;
