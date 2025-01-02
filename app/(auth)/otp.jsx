import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
  Image,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import CheckBox from "react-native-elements/dist/checkbox/CheckBox";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../../redux/slices/userSlice";

// Define your server URL here
const SERVER_URL = `${process.env.EXPO_PUBLIC_SERVER}`; // Replace with your actual backend URL

const Otp = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const data = useLocalSearchParams();
  const phoneNumber = data.phoneNumber;

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [allowWhatsApp, setAllowWhatsApp] = useState(false);
  const [loading, setLoading] = useState(false);

  // Refs for OTP inputs to handle auto-focus
  const otpRefs = useRef([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer === 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value, index) => {
    if (/^\d*$/.test(value)) {
      // Ensure only digits are entered
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move focus to next input if a digit is entered
      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1].focus();
      }
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.length < 4) {
      Alert.alert("Error", "Please enter the complete OTP.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Verify OTP
      const verifyResponse = await fetch(`${SERVER_URL}/users/verifyOTP`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber, otp: enteredOtp }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResponse.ok && verifyResult.success) {
        // Step 2: Login or Sign Up
        const loginResponse = await fetch(`${SERVER_URL}/users/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber,
            referralCode,
            whatsappNotification: true,
            termAndCondition: true, // If term and condition is handled elsewhere, include it accordingly
          }),
        });

        const loginResult = await loginResponse.json();

        if (loginResponse.ok && loginResult.token) {
          console.log("loginResult", loginResult);
          // Store the token securely
          await AsyncStorage.setItem("token", loginResult.token);
          console.log(await AsyncStorage.getItem("token"));

          dispatch(setUserDetails(loginResult.userData));
          router.replace("/Home");
        } else {
          Alert.alert("Error", loginResult.message || "Failed to login.");
        }
      } else {
        Alert.alert(
          "Error",
          verifyResult.message || "OTP verification failed."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during OTP verification.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (canResend) {
      setLoading(true);

      try {
        const resendResponse = await fetch(`${SERVER_URL}/users/smsOTP`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        });

        const resendResult = await resendResponse.json();

        if (resendResponse.ok && resendResult.success) {
          Alert.alert("Success", "OTP resent successfully.");
          setTimer(60);
          setCanResend(false);
          setOtp(["", "", "", ""]);
          otpRefs.current[0].focus();
        } else {
          Alert.alert("Error", resendResult.message || "Failed to resend OTP.");
        }
      } catch (error) {
        console.error(error);
        Alert.alert("Error", "An error occurred while resending OTP.");
      } finally {
        setLoading(false);
      }
    }
  };

  function onChangePress() {
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperBox}>
        <Image
          source={require("../../assets/images/easybull-high-resolution-logo-transparent.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.content}>
        <Text style={styles.headerText}>Enter OTP</Text>
        <Text style={styles.subHeaderText}>
          OTP sent to {phoneNumber}{" "}
          <TouchableOpacity onPress={onChangePress}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
        </Text>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (otpRefs.current[index] = ref)}
              style={styles.otpInput}
              value={digit}
              onChangeText={(value) => handleOtpChange(value, index)}
              keyboardType="number-pad"
              maxLength={1}
              returnKeyType="next"
              onSubmitEditing={() => {
                if (index < otp.length - 1) {
                  otpRefs.current[index + 1].focus();
                } else {
                  handleVerify();
                }
              }}
              blurOnSubmit={false}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[styles.verifyButton, !otp.every(Boolean) && styles.disabled]}
          onPress={handleVerify}
          disabled={!otp.every(Boolean) || loading}
        >
          <Text style={styles.buttonText}>Verify OTP</Text>
          {loading && (
            <ActivityIndicator
              style={styles.loading}
              size={"small"}
              color="white"
            />
          )}
        </TouchableOpacity>
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>
            {canResend ? "Didn't receive OTP?" : `Resend OTP in ${timer}s`}
          </Text>
          <TouchableOpacity onPress={handleResendOtp} disabled={!canResend}>
            <Text style={[styles.resendButton, !canResend && styles.disabled]}>
              Resend OTP
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.referralContainer}>
          <Icon name="gift" size={20} color="#FF5723" />
          <TextInput
            style={styles.referralInput}
            placeholder="Enter referral code (optional)"
            value={referralCode}
            onChangeText={setReferralCode}
          />
        </View>
        {/* <CheckBox
          title="Allow WhatsApp notifications"
          checked={allowWhatsApp}
          onPress={() => setAllowWhatsApp(!allowWhatsApp)}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          checkedColor="#01BD35"
          activeOpacity={0.9}
        /> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fc4100",
    // backgroundColor: "#FF5723",
    justifyContent: "space-between",
  },
  upperBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 300,
    height: 200,
  },
  welcomeText: {
    fontSize: 82,
    fontWeight: "bold",
    color: "#f5f5f5",
  },
  content: {
    backgroundColor: "#f5f5f5",
    // flex: 1,
    // padding: 20,
    paddingVertical: 40,
    paddingHorizontal: 0,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  changeButtonText: {
    color: "#1230ae", // Blue color for the "Change" text
    fontWeight: "600",
    marginLeft: 10,
    // textDecorationLine: "underline", // Optional: underline the text to make it look like a link
  },
  subHeaderText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    textAlign: "center",
    fontSize: 24,
  },
  verifyButton: {
    backgroundColor: "#01BD35",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginBottom: 20,
    width: "80%",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  loading: {
    padding: 0,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  resendText: {
    marginRight: 10,
    fontSize: 16,
  },
  resendButton: {
    color: "#FF5723",
    fontWeight: "bold",
    fontSize: 16,
  },
  referralContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    width: "80%",
  },
  referralInput: {
    flex: 1,
    marginLeft: 10,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 5,
    fontSize: 16,
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    margin: 0,
  },
  checkBoxText: {
    fontWeight: "normal",
    fontSize: 16,
  },
  disabled: {
    opacity: 0.5,
  },
});

export default Otp;
