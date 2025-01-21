import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { clearUserDetails, fetchUser } from "../../redux/slices/userSlice";
import { clearTradeDetails } from "../../redux/slices/tradeSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

const MenuItem = ({ icon: Icon, title, onPress, showBorder = true }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.menuItem, showBorder && styles.menuItemBorder]}
    >
      <View style={styles.menuItemLeft}>
        <Icon />
        <Text style={styles.menuItemText}>{title}</Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );
};

const Profile = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    dispatch(fetchUser());
  }, []);

  const handleLogout = async () => {
    try {
      dispatch(clearUserDetails());
      dispatch(clearTradeDetails());
      await AsyncStorage.removeItem("token");
      router.replace("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileSection}>
        <Image
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/2919/2919906.png",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userInfo?.name || "User Name"}</Text>
        <Text style={styles.userId}>User ID- {userInfo?.id || "696969"}</Text>
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceRow}>
          <MaterialIcons name="account-balance-wallet" size={24} color="#333" />
          <Text style={styles.balanceText}>My Balance</Text>
          <Text style={styles.balanceAmount}>₹50</Text>
        </View>
        <TouchableOpacity style={styles.addCashButton}>
          <Text style={styles.addCashText}>ADD CASH</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.menuContainer}
        contentContainerStyle={{ paddingBottom: 30 }} // Add this line
      >
        <MenuItem
          icon={() => (
            <FontAwesome5 name="user-friends" size={20} color="#666" />
          )}
          title="Refer & Earn"
          onPress={() => {
            router.push("Invite");
          }}
        />
        <MenuItem
          icon={() => (
            <MaterialIcons name="emoji-events" size={24} color="#666" />
          )}
          title="Winners"
          onPress={() => {
            router.push("Winners");
          }}
        />
        <MenuItem
          icon={() => <MaterialIcons name="settings" size={24} color="#666" />}
          title="My Info & Settings"
          onPress={() => {
            router.push("Info");
          }}
        />
        <MenuItem
          icon={() => (
            <Ionicons name="game-controller-outline" size={24} color="#666" />
          )}
          title="How to Play"
          onPress={() => {}}
        />
        <MenuItem
          icon={() => <MaterialIcons name="security" size={24} color="#666" />}
          title="Responsible Play"
          onPress={() => {}}
        />
        <MenuItem
          icon={() => (
            <MaterialIcons name="more-horiz" size={24} color="#666" />
          )}
          title="More"
          onPress={() => {}}
        />
        <MenuItem
          icon={() => (
            <MaterialIcons name="headset-mic" size={24} color="#666" />
          )}
          title="24x7 Help & Support"
          onPress={() => {
            router.push("Support");
          }}
          showBorder={false}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#881b20",
  },
  header: {
    padding: 16,
  },
  profileSection: {
    alignItems: "center",
    paddingBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  userId: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  balanceCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 8,
    padding: 16,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  balanceText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  addCashButton: {
    backgroundColor: "#008000",
    borderRadius: 4,
    paddingVertical: 12,
    alignItems: "center",
  },
  addCashText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  menuContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    paddingBottom: 80,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 12,
  },
});

export default Profile;
