import { View, Text, StyleSheet, StatusBar } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Entypo, FontAwesome6, MaterialIcons } from "@expo/vector-icons";

const Tab = () => {
  function TabIcon({ icon, name, focused }) {
    const iconColor = focused ? "#881b20" : "#CDCDE0";
    const textColor = focused ? "#881b20" : "#CDCDE0";
    return (
      <View
        style={styles.container}
        className="items-center justify-center gap-1"
      >
        {icon(iconColor)}
        <Text
          className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
          style={{
            color: textColor,
            fontWeight: focused ? "600" : "400",
            fontSize: 12,
          }}
        >
          {name}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarStyle: {
            minHeight: 55,
            justifyContent: "space-evenly",
          },
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
        }}
      >
        <Tabs.Screen
          name="Home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={(color) => <Entypo name="home" size={22} color={color} />}
                name={"Home"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="MyPosition"
          options={{
            title: "My Portfolio",
            headerStyle: { backgroundColor: "#881b20" },
            headerTintColor: "#fff",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={(color) => (
                  <MaterialCommunityIcons
                    name="bag-checked"
                    size={22}
                    color={color}
                  />
                )}
                name={"Portfolio"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Charts"
          options={{
            title: "Charts",
            // headerStyle: { backgroundColor: "#881b20" },
            headerShown: false,
            // headerTintColor: "#fff",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={(color) => (
                  <MaterialIcons
                    name="candlestick-chart"
                    size={22}
                    color={color}
                  />
                )}
                name={"Charts"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Learn"
          options={{
            headerStyle: { backgroundColor: "#881b20" },
            headerTintColor: "#fff",
            title: "Live News",
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={(color) => (
                  <FontAwesome6 name="graduation-cap" size={20} color={color} />
                )}
                name={"News"}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar barStyle={"dark-content"} />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 1,
  },
});

export default Tab;
