import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

const TradeOrderModal = ({
  visible,
  onClose,
  onSubmit,
  type = "buy", // 'buy' or 'sell'
  currentPrice,
  initialQuantity = "",
  onTypeChange,
}) => {
  const [orderType, setOrderType] = useState("market"); // 'market' or 'limit'
  const [quantity, setQuantity] = useState(initialQuantity.toString());
  const [price, setPrice] = useState(currentPrice?.toString() || "");
  const [totalUSD, setTotalUSD] = useState("");
  const [takeProfitEnabled, setTakeProfitEnabled] = useState(false);
  const [stopLossEnabled, setStopLossEnabled] = useState(false);
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [takeProfitUSD, setTakeProfitUSD] = useState("");
  const [takeProfitPercent, setTakeProfitPercent] = useState("");
  const [stopLossPrice, setStopLossPrice] = useState("");
  const [stopLossUSD, setStopLossUSD] = useState("");
  const [stopLossPercent, setStopLossPercent] = useState("");

  useEffect(() => {
    if (currentPrice && quantity) {
      const total = parseFloat(currentPrice) * parseFloat(quantity);
      setTotalUSD(total.toFixed(2));
    }
  }, [currentPrice, quantity]);

  const calculateValues = (newPrice, basePrice, setter) => {
    if (newPrice && basePrice) {
      const diff = parseFloat(newPrice) - parseFloat(basePrice);
      const percent = (diff / parseFloat(basePrice)) * 100;
      const usd = diff * parseFloat(quantity);
      setter({
        price: newPrice,
        usd: usd.toFixed(2),
        percent: percent.toFixed(2),
      });
    }
  };

  const handleTakeProfitPriceChange = (newPrice) => {
    setTakeProfitPrice(newPrice);
    calculateValues(newPrice, currentPrice, ({ usd, percent }) => {
      setTakeProfitUSD(usd);
      setTakeProfitPercent(percent);
    });
  };

  const handleStopLossPriceChange = (newPrice) => {
    setStopLossPrice(newPrice);
    calculateValues(newPrice, currentPrice, ({ usd, percent }) => {
      setStopLossUSD(usd);
      setStopLossPercent(percent);
    });
  };

  const handleTypeChange = (newType) => {
    if (onTypeChange) {
      onTypeChange(newType);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>BTCUSD</Text>

          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.sellButton,
                type === "sell" && styles.sellSelectedButton,
              ]}
              onPress={() => handleTypeChange("sell")}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  type === "sell" && styles.selectedActionButtonText,
                ]}
              >
                Sell
                {type === "sell" && `\n${currentPrice}`}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.buyButton,
                type === "buy" && styles.buySelectedButton,
              ]}
              onPress={() => handleTypeChange("buy")}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  type === "buy" && styles.selectedActionButtonText,
                ]}
              >
                Buy
                {type === "buy" && `\n${currentPrice}`}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.orderTypeContainer}>
            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === "market" && styles.selectedOrderType,
              ]}
              onPress={() => setOrderType("market")}
            >
              <Text style={styles.orderTypeText}>Market</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.orderTypeButton,
                orderType === "limit" && styles.selectedOrderType,
              ]}
              onPress={() => setOrderType("limit")}
            >
              <Text style={styles.orderTypeText}>Limit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Units</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderTopLeftRadius: 8, borderBottomLeftRadius: 8 },
                ]}
              >
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#a0aec0"
                />
              </View>
            </View>

            <View style={styles.inputDivider} />

            <View style={styles.inputGroup}>
              <Text style={styles.label}>USD</Text>
              <View
                style={[
                  styles.inputWrapper,
                  { borderTopRightRadius: 8, borderBottomRightRadius: 8 },
                ]}
              >
                <TextInput
                  style={[
                    styles.input,
                    !orderType === "limit" && styles.inputDisabled,
                  ]}
                  value={totalUSD}
                  editable={orderType === "limit"}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor="#a0aec0"
                />
              </View>
            </View>
          </View>

          <View style={styles.orderSettingsContainer}>
            {/* Checkboxes Section */}
            <View style={styles.checkboxesContainer}>
              <TouchableOpacity
                style={styles.checkboxWrapper}
                onPress={() => setTakeProfitEnabled(!takeProfitEnabled)}
              >
                <View
                  style={[
                    styles.checkbox,
                    takeProfitEnabled && styles.checkboxChecked,
                  ]}
                >
                  {takeProfitEnabled && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Take Profit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.checkboxWrapper}
                onPress={() => setStopLossEnabled(!stopLossEnabled)}
              >
                <View
                  style={[
                    styles.checkbox,
                    stopLossEnabled && styles.checkboxChecked,
                  ]}
                >
                  {stopLossEnabled && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkboxLabel}>Stop Loss</Text>
              </TouchableOpacity>
            </View>

            {/* Price Section */}
            <View style={styles.settingSection}>
              <TextInput
                style={[
                  styles.settingInput,
                  !takeProfitEnabled && styles.disabledInput,
                  { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                ]}
                value={takeProfitPrice}
                onChangeText={handleTakeProfitPriceChange}
                keyboardType="decimal-pad"
                editable={takeProfitEnabled}
                placeholder="0.00"
              />
              <View style={styles.labelContainer}>
                <Text style={styles.sectionLabel}>Price</Text>
              </View>
              <TextInput
                style={[
                  styles.settingInput,
                  !stopLossEnabled && styles.disabledInput,
                  { borderTopLeftRadius: 8, borderTopRightRadius: 8 },
                ]}
                value={stopLossPrice}
                onChangeText={handleStopLossPriceChange}
                keyboardType="decimal-pad"
                editable={stopLossEnabled}
                placeholder="0.00"
              />
            </View>

            {/* USD Section */}
            <View style={styles.settingSection}>
              <TextInput
                style={[styles.settingInput, styles.disabledInput]}
                value={takeProfitUSD}
                editable={false}
                placeholder="0.00"
              />
              <View style={styles.labelContainer}>
                <Text style={styles.sectionLabel}>USD</Text>
              </View>
              <TextInput
                style={[styles.settingInput, styles.disabledInput]}
                value={stopLossUSD}
                editable={false}
                placeholder="0.00"
              />
            </View>

            {/* Percentage Section */}
            <View style={styles.settingSection}>
              <TextInput
                style={[
                  styles.settingInput,
                  styles.disabledInput,
                  { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                ]}
                value={takeProfitPercent}
                editable={false}
                placeholder="0"
              />
              <View style={styles.labelContainer}>
                <Text style={styles.sectionLabel}>%</Text>
              </View>
              <TextInput
                style={[
                  styles.settingInput,
                  styles.disabledInput,
                  { borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
                ]}
                value={stopLossPercent}
                editable={false}
                placeholder="0"
              />
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.submitButton,
                { backgroundColor: type === "buy" ? "#007AFF" : "#da352c" },
              ]}
              onPress={() =>
                onSubmit({
                  type,
                  orderType,
                  quantity,
                  price: orderType === "market" ? currentPrice : price,
                  target: takeProfitEnabled
                    ? {
                        price: takeProfitPrice,
                        usd: takeProfitUSD,
                        percent: takeProfitPercent,
                      }
                    : null,
                  stopLoss: stopLossEnabled
                    ? {
                        price: stopLossPrice,
                        usd: stopLossUSD,
                        percent: stopLossPercent,
                      }
                    : null,
                })
              }
            >
              <Text style={styles.submitButtonText}>
                {type === "buy" ? "Buy" : "Sell"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    // textAlign: "center",
    // marginBottom: 20,
  },
  // buttonGroup: {
  //   flexDirection: "row",
  //   marginBottom: 20,
  //   gap: 10,
  // },
  actionButton: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  sellButton: {
    backgroundColor: "#f8f9fa",
  },
  buyButton: {
    backgroundColor: "#f8f9fa",
  },
  sellSelectedButton: {
    backgroundColor: "#da352c",
  },
  buySelectedButton: {
    backgroundColor: "#007aff",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#000", // Default color for unselected state
  },
  selectedActionButtonText: {
    color: "white", // Color for selected state
  },
  orderTypeContainer: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#dee2e6",
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
  },
  selectedOrderType: {
    borderBottomWidth: 3,
    borderBottomColor: "#881b20",
  },
  orderTypeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    // backgroundColor: "#f7f9fc",
    borderRadius: 12,
    // padding: 16,
    marginVertical: 15,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: 2 },
    //     shadowOpacity: 0.05,
    //     shadowRadius: 3,
    //   },
    //   android: {
    //     elevation: 2,
    //   },
    // }),
  },
  inputGroup: {
    flex: 1,
  },
  inputDivider: {
    // width: 1,
    // backgroundColor: "#e2e8f0",
    // marginHorizontal: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748b",
    marginBottom: 8,
  },
  inputWrapper: {
    backgroundColor: "white",
    // borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  input: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1a202c",
    paddingHorizontal: 12,
    paddingVertical: 6,
    // minHeight: 44,
  },
  inputDisabled: {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
  },
  // New styles for Take Profit and Stop Loss
  orderSettingsContainer: {
    marginVertical: 10,
    // backgroundColor: "#f7f9fc",
    borderRadius: 12,
    // padding: 16,
    // ...Platform.select({
    //   ios: {
    //     shadowColor: "#000",
    //     shadowOffset: { width: 0, height: -2 },
    //     shadowOpacity: 0.1,
    //     shadowRadius: 4,
    //   },
    //   android: {
    //     elevation: 2,
    //   },
    // }),
  },
  checkboxesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: "#999",
    marginRight: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#881b20",
    borderColor: "#881b20",
  },
  checkmark: {
    color: "white",
    fontSize: 14,
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },
  settingSection: {
    flexDirection: "row",
    alignItems: "center",
    // marginBottom: 16,
    gap: 8,
  },
  labelContainer: {
    paddingHorizontal: 8,
    minWidth: 50,
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
    textAlign: "center",
  },
  settingInput: {
    flex: 1,
    // padding: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    // borderRadius: 8,
    backgroundColor: "white",
    textAlign: "center",
    fontSize: 16,
  },
  disabledInput: {
    backgroundColor: "#f1f5f9",
    color: "#94a3b8",
  },
  buttonGroup: {
    flexDirection: "row",
    // justifyContent: "space-between",
    marginTop: 20,
    gap: 10,
  },
  labelsContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 10,
    marginTop: 40,
  },
  labelText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginVertical: 8,
  },
  cancelButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#d3d3d3",
  },
  cancelButtonText: {
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  submitButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 8,
  },
  submitButtonText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});

export default TradeOrderModal;
