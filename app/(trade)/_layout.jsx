import { StatusBar, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import Entypo from "@expo/vector-icons/Entypo";
import Wallet from "../../components/Wallet";
import moment from "moment";
import { clearTradeDetails } from "../../redux/slices/tradeSlice";

const AuthLayout = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const tradeBal = useSelector((state) => state.trade.totalBalance);
  const tradeId = useSelector((state) => state.trade.tradeHistory);
  const t1 = useSelector((state) => state.trade.end);

  const [t2, setT2] = useState(moment().format("h:mm:ss"));
  const [isAfter, setIsAfter] = useState(true);

  useEffect(() => {
    if (!t1) {
      setT2("N/A");
      setIsAfter(false);
      return; // Exit the effect early if there's no t1
    }

    const interval = setInterval(() => {
      const currentTime = moment();

      const duration = moment.duration(moment(t1).diff(currentTime));
      setT2(`${duration.hours()}:${duration.minutes()}:${duration.seconds()}`);

      if (currentTime.isAfter(t1)) {
        dispatch(clearTradeDetails());
        router.push("/Home");
        setIsAfter(false);
        clearInterval(interval); // Clear the interval once time is past t1
      } else {
        setIsAfter(true);
      }
    }, 1000);

    return () => clearInterval(interval); // Clear interval on unmount or re-render
  }, [t1, dispatch, router]);

  const HeaderRight = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginRight: 15,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
      }}
    >
      <Entypo
        name="wallet"
        size={20}
        color="white"
        style={{ marginRight: 8 }}
      />
      <Text style={{ color: "white", fontSize: 16 }}>
        ₹{userInfo?.money?.toLocaleString("en-IN") || "0"}
      </Text>
    </View>
  );

  function MainHeader() {
    return (
      <>
        <Text>{t2}</Text>
        <Wallet
          money={tradeBal}
          onPress={() =>
            router.push({
              pathname: "tradeHistory",
              params: {
                tradeId: tradeId._id,
              },
            })
          }
        />
      </>
    );
  }

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
          name="main"
          options={({ route }) => {
            return {
              title: route?.params?.instrumentName || "Trade",
              headerRight: () => <MainHeader />,
            };
          }}
        />
        <Stack.Screen
          name="gamesOpen"
          options={({ route }) => {
            return {
              title: route?.params?.instrumentName || "Trade",
              headerRight: () => <HeaderRight />,
            };
          }}
        />
        <Stack.Screen
          name="tradeHistory"
          options={() => {
            return {
              title: "Trade History",
              // headerRight: () => <HeaderRight />,
            };
          }}
        />
      </Stack>
      <StatusBar backgroundColor="#fc4100" barStyle={"light"} />
    </>
  );
};

export default AuthLayout;
