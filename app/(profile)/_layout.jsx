import { StatusBar } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const AuthLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#881b20",
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
        <Stack.Screen
          name="Invite"
          options={{
            title: "Invite Friends",
          }}
        />
        <Stack.Screen
          name="Winners"
          options={{
            title: "Winners",
          }}
        />
        <Stack.Screen
          name="Info"
          options={{
            title: "My Info & Settings",
          }}
        />
        <Stack.Screen
          name="Support"
          options={{
            title: "24/7 Help and Support",
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#881b20" barStyle={"light-content"} />
    </>
  );
};

export default AuthLayout;
