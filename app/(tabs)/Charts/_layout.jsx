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
          name="index"
          options={({ route }) => ({
            title: "Charts",
            // headerShown: false,
          })}
        />
        <Stack.Screen
          name="chartss" // Route name remains 'chartss'
          options={({ route }) => {
            return {
              headerTitle: route?.params?.title
                ? `${route.params.title}`
                : "Chart",
            };
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#881b20" barStyle={"light-content"} />
    </>
  );
};

export default AuthLayout;
