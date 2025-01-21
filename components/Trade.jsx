import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  clearTradeDetails,
  fetchTradeHistory,
  placeTrade as hello,
} from "../redux/slices/tradeSlice";
import TradeOrderModal from "./TradeOrderModal";
// import { fetchUser } from "../../redux/slices/userSlice";

const Trade = ({ contestData }) => {
  const { contestId } = useLocalSearchParams();
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState("1");
  const [tradeId, setTradeId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(1000);
  const [activeTab, setActiveTab] = useState("trade");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tradeType, setTradeType] = useState("buy");
  // console.log("activeTab", activeTab);

  const webViewRef = useRef(null);
  const dispatch = useDispatch();
  const trade = useSelector((state) => state.trade);
  const userInfo = useSelector((state) => state.user.userInfo);
  const apiKey = "T2EER0G2CYSG5OOR";
  // console.log("userInfo", userInfo);
  // console.log("trade", trade);
  // console.log("contestData", contestData);

  useEffect(
    () => {
      // dispatch(fetchUser());
      if (tradeId) {
        console.log("tradeId", tradeId);

        dispatch(fetchTradeHistory(tradeId));
      }
    },
    [
      // tradeId, contestId
    ]
  );

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener("beforeRemove", (e) => {
  //     // Prevent default behavior of back button
  //     e.preventDefault();

  //     // Dispatch the clearTradeDetails action
  //     dispatch(clearTradeDetails());

  //     // Navigate back
  //     navigation.dispatch(e.data.action);
  //   });
  //   return unsubscribe;
  // }, [navigation, dispatch]);

  // useEffect(() => {
  //   checkContestAccess();
  // }, [contestId]);

  // const checkContestAccess = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${process.env.EXPO_PUBLIC_SERVER}/contests/${contestId}`
  //     );

  //     if (response.status != 200) {
  //       throw new Error(response.message | "Error fetching");
  //     }

  //     const contest = response.data;

  //     // Check if user is a participant
  //     const isParticipant = contest.participants.find(
  //       (p) => p.user === userInfo?._id
  //     );

  //     console.log("isParticipant", isParticipant.tradeId);

  //     if (!isParticipant.tradeId) {
  //       Alert.alert(
  //         "Access Denied",
  //         "You are not a participant in this contest"
  //       );
  //       navigation.navigate("Home");
  //       return;
  //     }

  //     setTradeId(isParticipant.tradeId);

  //     // Store contest data
  //     setContestData(contest);
  //     setLoading(false);
  //   } catch (error) {
  //     console.log(error);

  //     Alert.alert("Error", "Failed to load contest data");
  //     // navigation.navigate("Home");
  //   }
  // };

  const tradingViewHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body, html {
          margin: 0;
          padding: 0;
          overflow: hidden;
          height: 100%;
          width: 100%;
        }
        .tradingview-widget-container {
          height: 100%;
          width: 100%;
        }
      </style>
    </head>
    <body>
      <div class="tradingview-widget-container">
        <div class="tradingview-widget-container__widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js" async>
        {
          "autosize": true,
          "symbol": "${contestData?.instrument?.symbol}",
          "interval": "D",
          "timezone": "Asia/Kolkata",
          "theme": "light",
          "style": "1",
          "save_image": false,
          "range": "1D",
          "locale": "en",
          "allow_symbol_change": false,
          "calendar": false,
          "support_host": "https://www.tradingview.com"
        }
        </script>
      </div>
    </body>
    </html>
  `;

  const updateQuantity = (increment) => {
    const currentVal = parseFloat(quantity);
    let newVal = increment ? currentVal + 0.01 : currentVal - 0.01;
    newVal = Math.max(0.01, Math.round(newVal * 100) / 100);
    setQuantity(newVal.toFixed(2));
  };

  const handleQuantityChange = (text) => {
    // Allow only numbers and up to 2 decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (regex.test(text)) {
      setQuantity(text);
    }
  };

  const getCurrentPrice = async (symbol, market) => {
    let url;

    if (market === "Indices") {
      url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=1min&apikey=${apiKey}`;
    } else if (market === "cryptocurrency") {
      url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=${apiKey}`;
    } else if (market === "Forex") {
      const [fromCurrency, toCurrency] = symbol.split("/");
      url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${fromCurrency}&to_currency=${toCurrency}&apikey=${apiKey}`;
    } else {
      Alert.alert("Error", "Invalid market type");
      return;
    }
    console.log("url", url);

    setLoading(true);
    try {
      const response = await axios.get(url);
      const data = response.data;
      console.log("price", data);

      if (market === "stock") {
        const timeSeries = data["Time Series (1min)"];
        const latestTimestamp = Object.keys(timeSeries)[0];
        return timeSeries[latestTimestamp]["4. close"];
      } else {
        return data["Realtime Currency Exchange Rate"]["5. Exchange Rate"];
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const placeTrade = async (tradeType) => {
    try {
      setLoading(true);
      if (!contestData) {
        Alert.alert("Error", "Invalid trade data");
        return;
      }

      const participant = contestData.participants.find(
        (p) => p.user === userInfo?._id
      );

      if (!participant?.tradeId) {
        Alert.alert("Error", "Trade ID not found");
        return;
      }

      let currentPrice = await getCurrentPrice(
        contestData.instrument.symbolName,
        contestData.instrument.type
      );
      console.log(
        "currentPrice",
        currentPrice,
        typeof parseFloat(currentPrice)
      );

      const tradeData = {
        tradeId: participant.tradeId,
        contestId,
        tradeType,
        quantity: parseFloat(quantity),
        price: currentPrice,
      };

      // dispatch(hello(tradeData)).unwrap;
      const res = await dispatch(hello(tradeData)).unwrap();
      // console.log("Trade placed successfully:", res);
      // const res = await dispatch(placeTrade(tradeData)).unwrap();

      // const response = await axios.post(
      //   `${process.env.EXPO_PUBLIC_SERVER}/trades/place`,
      //   tradeData
      // );
      if (res.status !== 201) {
        Alert.alert("Error", "Failed to place trade");
        return;
      }
      Alert.alert("Success", `${tradeType} order placed successfully`);
    } catch (error) {
      console.log("error", error);

      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to place trade"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TradeOrderModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={(orderDetails) => {
          console.log(orderDetails);
          // Call your placeTrade function here with the order details
          placeTrade(orderDetails.type);
          setIsModalVisible(false);
        }}
        type={tradeType}
        currentPrice={currentPrice}
        initialQuantity="1"
        onTypeChange={(newType) => setTradeType(newType)}
      />
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: tradingViewHtml }}
        style={styles.webView}
      />
      <View style={styles.tradingControls}>
        <TouchableOpacity
          style={styles.orderButton}
          // onPress={() => placeTrade("sell")}
          onPress={() => {
            setTradeType("sell");
            setIsModalVisible(true);
          }}
          disabled={loading}
        >
          <Text style={styles.orderButtonText}>SELL</Text>
        </TouchableOpacity>

        {/* <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(false)}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.quantityInput}
            value={quantity}
            onChangeText={handleQuantityChange}
            keyboardType="decimal-pad"
            maxLength={10}
          />

          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => updateQuantity(true)}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View> */}

        <TouchableOpacity
          style={[styles.orderButton, styles.buyButton]}
          // onPress={() => placeTrade("buy")}
          onPress={() => {
            setTradeType("buy");
            setIsModalVisible(true);
          }}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.orderButtonText}>BUY</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#65301D",
  },
  webView: {
    // flex: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    // padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    position: "relative",
  },
  activeTabButton: {
    backgroundColor: "transparent",
  },
  tabButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  activeTabButtonText: {
    color: "#881b20",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: "#881b20",
    borderRadius: 1.5,
  },
  tradingControls: {
    flexDirection: "row",
    // padding: 15,
    // backgroundColor: "#65301D",
    alignItems: "center",
    justifyContent: "space-between",
  },
  orderButton: {
    backgroundColor: "#ff3b30",
    padding: 15,
    // borderRadius: 8,
    width: "50%",
    alignItems: "center",
  },
  buyButton: {
    backgroundColor: "#007aff",
  },
  orderButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5B488",
    borderRadius: 8,
    padding: 5,
  },
  quantityButton: {
    backgroundColor: "#65301D",
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  quantityInput: {
    backgroundColor: "white",
    width: 80,
    marginHorizontal: 10,
    padding: 8,
    borderRadius: 4,
    textAlign: "center",
    color: "#65301D",
    fontWeight: "bold",
  },
});

export default Trade;
