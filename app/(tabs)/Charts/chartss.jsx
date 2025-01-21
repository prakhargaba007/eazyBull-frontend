import { StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";

const charts = () => {
  const { symbolId } = useLocalSearchParams();
  const webViewRef = useRef(null);
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
        "symbol": "${symbolId}",
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
  return (
    <View style={{ flex: 1, backgroundColor: "#f0f0f0" }}>
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: tradingViewHtml }}
        // style={styles.webView}
      />
    </View>
  );
};

export default charts;

const styles = StyleSheet.create({});
