import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome";
import CheckBox from "react-native-elements/dist/checkbox/CheckBox";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SignIn = () => {
  const router = useRouter();
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          router.replace("/Home");
        }
      } catch (error) {
        console.error("Failed to get token", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkToken();
  }, []);

  // if (isLoading) {
  //   return (
  //     <SafeAreaView style={styles.container}>
  //       <Text>Loading...</Text>
  //     </SafeAreaView>
  //   );
  // }
  const [isFocused, setIsFocused] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!isChecked) {
      Alert.alert("Please confirm that you are 18+ in age");
      return;
    }
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert("Please enter a valid 10-digit phone number");
      return;
    }

    setIsLoading(true);
    // console.log(process.env.EXPO_PUBLIC_SERVER);

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SERVER}/users/smsOTP`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ phoneNumber }),
        }
      );

      if (!response.ok) {
        console.log("response", response);
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log("Login successful:", data);

      if (data.success) {
        router.push({
          pathname: "/otp",
          params: {
            phoneNumber: phoneNumber,
          },
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Login/Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.upperBox}>
        {/* <Text style={styles.welcomeText}>Eazy Bull</Text> */}
        <Image
          source={require("../../assets/images/easybull-high-resolution-logo-transparent.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.signInForm}>
        <Text style={styles.headerText}>Login / Register</Text>
        <View style={styles.inputContainer}>
          <View style={[styles.inputWrapper, isFocused && styles.inputFocused]}>
            <Icon name="phone" size={23} color="#000" />
            <View style={styles.input}>
              <Text style={styles.nineOne}>+91</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter Phone Number"
                placeholderTextColor="#7B7B8B"
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                maxLength={10}
              />
            </View>
          </View>
        </View>
        <CheckBox
          title="I confirm that I am 18+ in age"
          checked={isChecked}
          onPress={() => setIsChecked(!isChecked)}
          containerStyle={styles.checkBoxContainer}
          textStyle={styles.checkBoxText}
          checkedColor="#01BD35"
          activeOpacity={0.9}
          Component={TouchableOpacity}
          wrapperStyle={styles.checkBoxWrapper}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          style={[styles.continueButton, isLoading && styles.disabled]}
          onPress={handleContinue}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>Continue</Text>
          {isLoading && (
            <ActivityIndicator
              animating={isLoading}
              color="#fff"
              size="small"
              className="ml-2"
            />
          )}
        </TouchableOpacity>
        <Text style={styles.termsText}>
          By continuing, you agree to our{" "}
          <Text
            style={styles.linkText}
            onPress={() =>
              Linking.openURL("https://www.google.co.in/").catch((err) =>
                Alert.alert("Failed to open URL:", err)
              )
            }
          >
            Terms of Service
          </Text>{" "}
          &{" "}
          <Text
            style={styles.linkText}
            onPress={() =>
              Linking.openURL("https://www.google.co.in/").catch((err) =>
                Alert.alert("Failed to open URL:", err)
              )
            }
          >
            Privacy Policy
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fc4100",
    justifyContent: "space-between",
  },
  logo: {
    width: 300,
    height: 200,
  },
  upperBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 82,
    fontWeight: "bold",
    color: "#f5f5f5",
  },
  signInForm: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 40,
    paddingHorizontal: 30,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: "center",
  },
  headerText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 10,
  },
  disabled: {
    opacity: 0.5,
  },
  inputWrapper: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#7B7B8B",
  },
  inputFocused: {
    borderColor: "#597E52",
  },
  textInput: {
    fontSize: 16,
    color: "#333333",
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  nineOne: {
    fontSize: 16,
  },
  checkBoxContainer: {
    backgroundColor: "transparent",
    borderColor: "transparent",
    marginBottom: 15,
    alignSelf: "flex-start", // Align the checkbox to the left
    alignItems: "center",
    marginLeft: 0, // Remove any default margin that might center it
    padding: 0,
  },
  checkBoxWrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  continueButton: {
    flexDirection: "row",
    gap: 5,
    width: "100%",
    backgroundColor: "#01BD35",
    paddingVertical: 15,
    textAlign: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  termsText: {
    fontSize: 12,
    color: "#7B7B8B",
    textAlign: "center",
    marginTop: 10,
  },
  linkText: {
    // color: "#01BD35",
    textDecorationLine: "underline",
  },
});
