import {
  Image,
  ScrollView,
  ScrollViewComponent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails, fetchUser } from "../../redux/slices/userSlice";
import { clearTradeDetails } from "../../redux/slices/tradeSlice";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const SettingsContainer = ({ onPress, title, icon: Icon }) => {
    return (
      <TouchableOpacity
        style={styles.settingItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.settingLeft}>
          {/* Render the icon component */}
          {Icon && <Icon />}
          <Text style={styles.settingText}>{title}</Text>
        </View>
        <AntDesign name="arrowright" size={20} color="#666" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <AntDesign name="arrowleft" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.profileSection}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/2919/2919906.png",
            }}
            style={styles.profileImage}
          />

          <View style={styles.nameContainer}>
            <Text style={styles.nameText}>{userInfo?.name || "User Name"}</Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.editButton}>
              <MaterialCommunityIcons
                name="pencil-outline"
                size={20}
                color="#fff"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.viewProfileButton}
            onPress={() => {
              console.log("pressed");
            }}
          >
            <Text style={styles.viewProfileText}>View Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.settingsContainer}>
        <SettingsContainer
          title="Account Settings"
          onPress={() => router.push("")}
          icon={() => (
            <FontAwesome
              name="user-circle-o"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />

        <SettingsContainer
          title="Notifications"
          onPress={() => router.push("/notifications")}
          icon={() => (
            <MaterialIcons
              name="notifications"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />

        <SettingsContainer
          title="Point system"
          onPress={() => router.push("/notifications")}
          icon={() => (
            <MaterialCommunityIcons
              name="progress-star"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />

        <SettingsContainer
          title="Withwrals"
          onPress={() => router.push("/privacy")}
          icon={() => (
            <FontAwesome6
              name="money-bill-transfer"
              size={19}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />
        <SettingsContainer
          title="Help and support"
          onPress={() => router.push("/privacy")}
          icon={() => (
            // <MaterialCommunityIcons name="help-network" size={24} color="black" />
            <MaterialCommunityIcons
              name="help-network"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />
        <SettingsContainer
          title="Privacy Policy"
          onPress={() => router.push("/privacy")}
          icon={() => (
            <MaterialIcons
              name="privacy-tip"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />
        <SettingsContainer
          title="Logout"
          onPress={async () => {
            try {
              dispatch(clearUserDetails());
              dispatch(clearTradeDetails());
              await AsyncStorage.removeItem("token");
              router.replace("/");
            } catch (error) {
              console.error("Error during logout:", error);
            }
          }}
          icon={() => (
            <MaterialCommunityIcons
              name="logout-variant"
              size={24}
              color="#333"
              style={styles.settingIcon}
            />
          )}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fc4100",
  },
  header: {
    padding: 10,
    display: "flex",
    flexDirection: "row",
  },
  backButton: {
    padding: 8,
    width: 40, // Fixed width for better touch target
  },
  profileSection: {
    alignItems: "center",
    padding: 24,
    width: 320,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  nameText: {
    fontSize: 24,
    fontWeight: "600",
    color: "#fff",
    marginRight: 8,
  },
  editButton: {
    padding: 8,
  },
  viewProfileButton: {
    // backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#fff",
  },
  viewProfileText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  settingsContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  settingItem: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 15,
    // elevation: 5,
    marginBottom: 10,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: "#333",
  },
});
