import { Image, StatusBar, Text, View } from "react-native";
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
  const profitLoss = useSelector((state) => state.trade.profitLoss);
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
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "90%",
        }}
      >
        <Image
          source={require("../../assets/images/easybull-high-resolution-logo-transparent.png")}
          style={{
            width: 40,
            height: 40,
            resizeMode: "contain",
          }}
        />
        <View
          style={{
            position: "absolute",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Text style={{ color: "#fff" }}>Ends in</Text>
            <Text style={{ color: "#fff" }}>{t2}</Text>
          </View>
        </View>
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "#fff" }}>P/L</Text>
          <Text style={{ color: "#fff" }}>{profitLoss.toFixed(2)}</Text>
        </View>
      </View>
    );
  }
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
          name="main"
          options={({ route }) => ({
            headerTitle: () => (
              <>
                {/* <Image
                  source={require("../../assets/images/easybull-high-resolution-logo-transparent.png")}
                  style={{
                    marginTop: 5,
                    width: 40,
                    height: 40,
                    resizeMode: "contain",
                    marginLeft: -20,
                  }}
                /> */}
                <Text
                  style={{
                    marginTop: 5,
                    resizeMode: "contain",
                    marginLeft: -50,
                  }}
                ></Text>
              </>
            ),
            headerRight: () => <MainHeader />,
            headerTitleAlign: "left",
          })}
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
      <StatusBar backgroundColor="#881b20" barStyle={"light"} />
    </>
  );
};

export default AuthLayout;
