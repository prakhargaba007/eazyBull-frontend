import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { store } from "../redux/store";

const queryClient = new QueryClient();
export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <Stack>
          <Stack.Screen
            name="(auth)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(payments)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(trade)"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="(profile)"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar backgroundColor="#161622" barStyle={"light-content"} />
      </Provider>
    </QueryClientProvider>
  );
}
