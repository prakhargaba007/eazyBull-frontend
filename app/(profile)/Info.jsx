import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { MaterialIcons, FontAwesome5, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const SettingsRow = ({
  icon: IconComponent,
  iconName,
  text,
  rightContent,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.settingsRow}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.settingsLeftContent}>
      {IconComponent && (
        <IconComponent
          name={iconName}
          size={20}
          color="#666"
          style={styles.rowIcon}
        />
      )}
      <Text style={styles.settingsText}>{text}</Text>
    </View>
    <View style={styles.settingsRightContent}>
      {rightContent ||
        (onPress && (
          <MaterialIcons name="chevron-right" size={20} color="#666" />
        ))}
    </View>
  </TouchableOpacity>
);

const EditableField = ({
  icon: IconComponent,
  iconName,
  label,
  value,
  onEdit,
}) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity
      style={styles.editableRow}
      onPress={onEdit}
      disabled={!onEdit}
      activeOpacity={0.7}
    >
      <View style={styles.fieldContent}>
        {IconComponent && (
          <IconComponent
            name={iconName}
            size={18}
            color="#666"
            style={styles.fieldIcon}
          />
        )}
        <Text style={styles.value}>{value}</Text>
      </View>
      {onEdit && <FontAwesome5 name="pen" size={16} color="#666" />}
    </TouchableOpacity>
  </View>
);

const GenderOption = ({ gender, selectedGender, onSelect }) => (
  <TouchableOpacity
    style={[
      styles.genderOption,
      selectedGender === gender && styles.genderOptionSelected,
    ]}
    onPress={() => onSelect(gender)}
    activeOpacity={0.7}
  >
    <View
      style={[
        styles.radioButton,
        selectedGender === gender && styles.radioButtonSelected,
      ]}
    >
      {selectedGender === gender && <View style={styles.radioButtonInner} />}
    </View>
    <Text
      style={[
        styles.genderText,
        selectedGender === gender && styles.genderTextSelected,
      ]}
    >
      {gender}
    </Text>
  </TouchableOpacity>
);

const Info = ({ isEditable = true, initialData = null }) => {
  const navigation = useNavigation();
  const [selectedGender, setSelectedGender] = useState(
    initialData?.gender || null
  );
  const [userData, setUserData] = useState({
    name: initialData?.name || "Prakhar Gaba",
    email: initialData?.email || "prakharprinters@gmail.com",
    phone: initialData?.phone || "9024987693",
    gender: initialData?.gender || null,
  });

  const handleUpdateProfile = async () => {
    try {
      // API call would go here
      console.log("Profile updated:", userData);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const handleGenderSelect = (gender) => {
    if (!isEditable) return;
    setSelectedGender(gender);
    setUserData((prev) => ({ ...prev, gender }));
  };

  const navigateToEdit = (field) => {
    navigation.navigate("EditField", { field, currentValue: userData[field] });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user" size={32} color="#666" />
        </View>
        <View style={styles.headerText}>
          <Text style={styles.headerName}>{userData.name}</Text>
          <Text style={styles.headerEmail}>{userData.email}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <SettingsRow
          icon={Feather}
          iconName="settings"
          text="Permissions and Settings"
          onPress={() => {}}
        />

        <EditableField
          icon={FontAwesome5}
          iconName="user"
          label="Name"
          value={userData.name}
        />

        <EditableField
          icon={Feather}
          iconName="mail"
          label="Email"
          value={userData.email}
          onEdit={() => navigateToEdit("email")}
        />

        <EditableField
          icon={Feather}
          iconName="phone"
          label="Mobile"
          value={userData.phone}
          onEdit={() => navigateToEdit("phone")}
        />

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderContainer}>
            {["Male", "Female", "Others"].map((gender) => (
              <GenderOption
                key={gender}
                gender={gender}
                selectedGender={selectedGender}
                onSelect={handleGenderSelect}
              />
            ))}
          </View>
        </View>

        <SettingsRow
          icon={Feather}
          iconName="settings"
          text="Manage Account"
          onPress={() => {}}
        />

        <SettingsRow
          icon={MaterialIcons}
          iconName="logout"
          text="Logout"
          onPress={() => {}}
        />
      </View>

      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateProfile}
        activeOpacity={0.8}
      >
        <Text style={styles.updateButtonText}>UPDATE PROFILE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 20,
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatarContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  headerText: {
    flex: 1,
  },
  headerName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  headerEmail: {
    fontSize: 14,
    color: "#666",
  },
  content: {
    backgroundColor: "white",
    marginTop: 10,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  settingsLeftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingsRightContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  rowIcon: {
    marginRight: 12,
  },
  settingsText: {
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    padding: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  fieldContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fieldIcon: {
    marginRight: 8,
  },
  value: {
    fontSize: 16,
    color: "#333",
  },
  editableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  genderContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginTop: 8,
    // flexWrap: "wrap",
  },
  genderOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  genderOptionSelected: {
    backgroundColor: "#fff0ed",
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#666",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    borderColor: "#881b20",
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#881b20",
  },
  genderText: {
    fontSize: 16,
    color: "#333",
  },
  genderTextSelected: {
    color: "#881b20",
  },
  updateButton: {
    backgroundColor: "#881b20",
    marginVertical: 16,
    marginHorizontal: 100,
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Info;
