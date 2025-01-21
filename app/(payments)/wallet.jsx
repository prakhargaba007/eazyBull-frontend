import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";

const Wallet = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    dispatch(fetchUser());
  }, []);
  console.log("userInfo", userInfo);

  const formattedMoney = new Intl.NumberFormat("en-IN").format(userInfo?.money);
  return (
    <SafeAreaView style={styles.container}>
      {/* Balance Container */}
      <View style={styles.balanceContainer}>
        <View style={styles.balanceInfo}>
          <View>
            <Text style={styles.balanceTitle}>Total Balance</Text>
            <Text style={styles.balanceAmount}>₹{formattedMoney}</Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                router.push("/TransactionHistory");
              }}
            >
              <Text style={styles.viewTransaction}>View Transaction</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/AddCash")}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Add Cash</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.winningBalanceContainer}>
          <View>
            <Text style={styles.winningBalanceTitle}>Winning Balance</Text>
            <Text style={styles.winningBalanceAmount}>₹0</Text>
          </View>
          <TouchableOpacity
            style={styles.withdrawButton}
            activeOpacity={0.7}
            disabled
          >
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        {/* <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.buttonText}>Add Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.withdrawButton} disabled>
            <Text style={styles.withdrawText}>Withdraw</Text>
          </TouchableOpacity>
        </View> */}
      </View>

      {/* Bonus Cash Container */}
      <View style={styles.bonusContainer}>
        <Text style={styles.bonusTitle}>Bonus Cash</Text>
        <Text style={styles.bonusDescription}>
          Use Bonus Cash to avail{" "}
          <Text style={styles.boldText}>flat 10% discount</Text> on all contests
        </Text>
        <View style={styles.bonusInfo}>
          <Text style={styles.bonusAmount}>0</Text>
          <Text style={styles.bonusRate}>(10 Bonus Cash = ₹1)</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Wallet;

const styles = StyleSheet.create({
  container: {
    height: "100%",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  balanceContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Add elevation for Android
    elevation: 3,
    // flexDirection: "row",
  },
  balanceInfo: {
    marginBottom: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: "black",
  },
  viewTransaction: {
    color: "#1E90FF",
    fontSize: 14,
  },
  winningBalanceContainer: {
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  winningBalanceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  winningBalanceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    backgroundColor: "#01BD35",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    height: 37,
  },
  withdrawButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  withdrawText: {
    color: "gray",
  },
  bonusContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    // Add shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    // Add elevation for Android
    elevation: 3,
  },
  bonusTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bonusDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  bonusInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bonusAmount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bonusRate: {
    fontSize: 12,
    color: "gray",
  },
});
