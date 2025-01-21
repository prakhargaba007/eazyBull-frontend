import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
} from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../redux/slices/userSlice";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import Wallet from "../../components/Wallet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BitcoinPriceCard from "../../components/PriceCard";

const HomeContent = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState("Bullet");
  // const [timeLeft, setTimeLeft] = useState(900);
  const [instruments, setInstruments] = useState([]);
  // console.log(instruments);

  const [loading, setLoading] = useState(true);

  // const getInitialTime = useCallback((mode) => {
  //   switch (mode) {
  //     case "Bullet":
  //       return 900;
  //     case "Rapid":
  //       return 2700;
  //     case "Classic":
  //       return 4500;
  //     default:
  //       return 900;
  //   }
  // }, []);

  useEffect(() => {
    const fetchInstruments = async () => {
      try {
        console.log("hello");
        console.log(
          "process.env.EXPO_PUBLIC_SERVER",
          process.env.EXPO_PUBLIC_SERVER
        );

        const response = await fetch(
          process.env.EXPO_PUBLIC_SERVER + "/instrument"
        );
        const data = await response.json();

        setInstruments(data);
      } catch (error) {
        console.error("Error fetching instruments:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInstruments();
    dispatch(fetchUser());
  }, []);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setTimeLeft((prevTime) => {
  //       if (prevTime > 0) return prevTime - 1;
  //       return getInitialTime(selectedMode);
  //     });
  //   }, 1000);
  //   // name();

  //   return () => clearInterval(timer);
  // }, [selectedMode, getInitialTime]);
  // async function name() {
  //   console.log(await AsyncStorage.getItem("token"));
  // }

  // const formatTime = (seconds) => {
  //   const hours = Math.floor(seconds / 3600);
  //   const minutes = Math.floor((seconds % 3600) / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${hours > 0 ? `${hours}:` : ""}${minutes
  //     .toString()
  //     .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  // };

  const GameModeButton = ({ mode, icon }) => (
    <TouchableOpacity
      style={[
        styles.gameModeButton,
        selectedMode === mode && styles.selectedGameMode,
      ]}
      onPress={() => {
        setSelectedMode(mode);
        // setTimeLeft(getInitialTime(mode));
      }}
      activeOpacity={0.7}
    >
      <FontAwesome5
        name={icon}
        size={18}
        color={selectedMode === mode ? "#881b20" : "#333"}
      />
      <Text
        style={[
          styles.gameModeText,
          selectedMode === mode && styles.selectedGameModeText,
        ]}
      >
        {mode}
      </Text>
    </TouchableOpacity>
  );

  const CategorySection = () => {
    return (
      <>
        {instruments.map((item) => {
          return (
            <TouchableOpacity
              key={item._id}
              activeOpacity={0.8}
              onPress={() =>
                router.push({
                  pathname: "gamesOpen",
                  params: {
                    instrumentId: item._id,
                    competitionType: selectedMode,
                    symbol: item.symbol,
                    instrumentName: item.title,
                  },
                })
              }
            >
              <BitcoinPriceCard data={item} />
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#fc4100" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#881b20" />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.profileButton}
            activeOpacity={0.7}
            onPress={() => {
              try {
                router.push("profile");
              } catch (error) {
                console.error("Navigation error:", error);
              }
            }}
          >
            <MaterialCommunityIcons
              name="face-man-profile"
              size={30}
              color="white"
            />
          </TouchableOpacity>
          <View style={styles.rightSection}>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
            {/* <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push("/wallet")}
            >
              <View style={styles.walletSection}>
                <Entypo name="wallet" size={24} color="white" />
                <Text style={styles.moneyText}>
                  ₹{userInfo?.money?.toLocaleString("en-IN") || "0"}
                </Text>
              </View>
            </TouchableOpacity> */}
            <Wallet
              money={userInfo?.money}
              onPress={() => router.push("/wallet")}
            />
          </View>
        </View>
        <View style={styles.gameModeContainer}>
          <GameModeButton mode="Bullet" icon="bolt" />
          <GameModeButton mode="Rapid" icon="tachometer-alt" />
          <GameModeButton mode="Classic" icon="chess" />
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.contentContainer}>
            <Text style={styles.welcomeText}>Upcoming Tournaments</Text>
            <CategorySection />
            {/* 
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                Next {selectedMode} trade starts in
              </Text>
              <Text style={styles.timerCountdown}>{formatTime(timeLeft)}</Text>
            </View> */}

            {/* <CategorySection title="Crypto Currencies" type="cryptocurrency" />
            <CategorySection title="Precious Metals" type="forex" />
            <CategorySection title="Stock Indices" type="indices" /> */}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  container: {
    flex: 1,
  },
  itemLeftSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  itemIcon: {
    marginRight: 10,
  },
  header: {
    flexDirection: "row",
    backgroundColor: "#881b20",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 7,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileButton: {
    padding: 8,
  },
  rightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginRight: 16,
  },
  walletSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  moneyText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  gameModeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingVertical: 5,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameModeButton: {
    alignItems: "center",
    paddingVertical: 2,
    paddingHorizontal: 35,
    borderRadius: 8,
  },
  selectedGameMode: {
    backgroundColor: "#fff0ed",
  },
  gameModeText: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  selectedGameModeText: {
    color: "#881b20",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  contentContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 20,
    color: "#333",
    fontWeight: "600",
    // marginBottom: 20,
  },
  categorySection: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemName: {
    fontSize: 16,
    color: "#333",
  },
  tradeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tradeButtonText: {
    fontSize: 14,
    color: "#ffffff",
  },
});

export default HomeContent;
