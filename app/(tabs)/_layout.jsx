import { View, Text, StyleSheet, StatusBar } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import AntDesign from "@expo/vector-icons/AntDesign";

const Tab = () => {
  function TabIcon({ icon, name, focused }) {
    const iconColor = focused ? "#FFD700" : "#CDCDE0";
    const textColor = focused ? "#FFD700" : "#CDCDE0";
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
            fontWeight: focused ? "900" : "400",
            // fontSize: 12,
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
            backgroundColor: "#fc4100",
            minHeight: 65,
            paddingBottom: 5,
            paddingTop: 5,
            justifyContent: "space-evenly", // Changed from "space-around" to "space-evenly"
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
                icon={(color) => (
                  <Feather name="home" size={24} color={color} />
                )}
                name={"Home"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="MyPosition"
          options={{
            title: "My Position",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={(color) => (
                  <MaterialCommunityIcons
                    name="bag-checked"
                    size={24}
                    color={color}
                  />
                )}
                name={"Positions"}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="Learn"
          options={{
            title: "Learn",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                icon={(color) => (
                  <AntDesign name="book" size={24} color={color} />
                )}
                name={"Learn"}
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
