import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { images } from "../../assets/images/assets";

const Invite = () => {
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [inviteData, setInviteData] = useState({
    maxAmount: 5000,
    collectedCash: 6025200,
    acceptedInvites: 1,
    friends: [
      {
        id: 1,
        name: "Arinnnn",
        username: "arinnnn",
        milestone: [
          {
            number: 1,
            entryAmount: 50,
            reward: 200,
          },
          {
            number: 2,
            entryAmount: 100,
            reward: 200,
          },
        ],
      },
      {
        id: 2,
        name: "User 2",
        username: "user2",
        milestone: [
          {
            number: 1,
            entryAmount: 49,
            reward: 200,
          },
        ],
      },
      {
        id: 3,
        name: "User 3",
        username: "user3",
        milestone: [
          {
            number: 1,
            entryAmount: 99,
            reward: 400,
          },
          {
            number: 2,
            entryAmount: 99,
            reward: 400,
          },
          {
            number: 3,
            entryAmount: 99,
            reward: 400,
          },
        ],
      },
    ],
  });

  const fetchInviteData = async () => {
    try {
      setLoading(true);
      // Replace with your actual API call
      // const response = await api.getInviteData();
      // setInviteData(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load invite data");
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      // Replace with your actual refresh logic
      await fetchInviteData();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInviteData();
  }, []);

  const renderHeader = () => (
    <>
      {/* Header Banner */}
      <View style={styles.banner}>
        <Image source={images.giftBox} style={styles.giftIcon} />
        <Text style={styles.bannerText}>
          Get upto ₹ {inviteData.maxAmount.toLocaleString()} per friend
        </Text>
      </View>

      {/* Collected Cash Section */}
      <View style={styles.collectedCash}>
        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.cashLabel}>Collected Cash</Text>
          <View style={styles.inviteCountContainer}>
            <Text style={styles.inviteCount}>
              Accepted Invites: {inviteData.acceptedInvites}
            </Text>
          </View>
        </View>
        <View style={styles.cashContainer}>
          <Text style={styles.cashAmount}>
            ₹ {inviteData.collectedCash.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Accepted Invites Header */}
      <View style={styles.invitesContainer}>
        <View style={styles.sectionTitleWrapper}>
          <Text style={styles.sectionTitle}>Accepted Invites</Text>
        </View>
        <Text style={styles.tip}>
          TIP: Get your friends to play more public cash contests and collect it
          all quicker!
        </Text>
      </View>
    </>
  );

  const renderFriend = ({ item: friend }) => (
    <View style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.friendName}>{friend.name}</Text>
          <Text style={styles.friendUsername}>{friend.username}</Text>
        </View>
      </View>

      {friend.milestone.map((milestone, index) => (
        <View key={index} style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <Text style={styles.milestoneTitle}>
              Milestone {milestone.number}
            </Text>
            <MaterialIcons name="info-outline" size={16} color="#666" />
          </View>
          <Text style={styles.entryAmount}>
            Entry amount left to play with: ₹{milestone.entryAmount}
          </Text>
          <View style={styles.rewardContainer}>
            <Text style={styles.rewardLabel}>You collect</Text>
            <Text style={styles.rewardAmount}>
              {milestone.reward} EazyCoins
            </Text>
          </View>
        </View>
      ))}
      <TouchableOpacity style={styles.viewMoreButton}>
        <Text style={styles.viewMoreText}>{"View More >"}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DC2626" />
      </View>
    );
  }

  if (error && !refreshing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchInviteData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={inviteData.friends}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#881b20"]}
            tintColor="#881b20"
          />
        }
        ListFooterComponent={
          <View style={{ paddingHorizontal: 16, marginTop: 30 }}>
            <Text style={styles.footerTitle}>Bring more friends</Text>
            <Text style={styles.footerSubtitle}>Collect more Cash!</Text>
          </View>
        }
      />

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.whatsappButton}>
            <MaterialIcons name="phone" size={24} color="#FFF" />
            <Text style={styles.buttonText}>INVITE NOW</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionsButton}>
            <MaterialIcons name="share" size={20} color="#666" />
            <Text style={styles.optionsButtonText}>OTHER OPTIONS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Invite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#DC2626",
    fontSize: 16,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFF",
    fontSize: 16,
  },
  banner: {
    backgroundColor: "#881b20",
    flexDirection: "row", // Align items horizontally
    alignItems: "center", // Vertically center all items
    borderRadius: 25,
    margin: 16,
    height: 90,
    paddingLeft: 3,
  },
  giftIcon: {
    width: 100,
    height: "100%", // Ensure it stretches to the base
    resizeMode: "contain", // Maintain the aspect ratio
    marginRight: 1, // Add spacing between image and text
  },
  bannerText: {
    flex: 1, // Take remaining space
    color: "#FFF",
    fontSize: 18,
    fontWeight: "600",
    textAlignVertical: "center", // Center text vertically inside its line height
  },

  cashContainer: {
    backgroundColor: "#881b20",
    margin: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  collectedCash: {},
  cashLabel: {
    color: "#881b20",
    fontSize: 16,
    fontWeight: "700",
  },
  inviteCountContainer: {
    alignSelf: "flex-end",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  inviteCount: {
    // color: "#FFF",
    fontSize: 12,
  },
  cashAmount: {
    color: "#FFF",
    fontSize: 24,
    fontWeight: "500",
    // marginTop: 8,
  },
  invitesContainer: {
    backgroundColor: "#FFF",
    margin: 16,
    marginBottom: 0,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  sectionTitleWrapper: {
    backgroundColor: "#edead3",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignSelf: "center",
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  tip: {
    color: "#666",
    fontSize: 12,
    fontStyle: "italic",
    marginBottom: 16,
    paddingHorizontal: 30,
    padding: 10,
    textAlign: "center",
  },
  friendCard: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
    // marginTop: 10,
  },
  friendInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    backgroundColor: "#E5E5E5",
    borderRadius: 20,
    marginRight: 12,
  },
  friendName: {
    fontSize: 16,
    fontWeight: "500",
  },
  friendUsername: {
    color: "#666",
    fontSize: 14,
  },
  milestoneCard: {
    backgroundColor: "#FFF8F0",
    padding: 16,
    borderRadius: 8,
  },
  milestoneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  milestoneTitle: {
    fontSize: 16,
    fontWeight: "500",
  },
  entryAmount: {
    color: "#666",
    fontSize: 14,
    marginBottom: 12,
  },
  rewardContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  rewardAmount: {
    fontSize: 14,
    fontWeight: "500",
  },
  viewMoreButton: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  viewMoreText: {
    // color: "#", // Adjust color as needed
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5E5",
  },
  footerTitle: {
    fontSize: 24,
    fontWeight: "600",
    // textAlign: "center",
  },
  footerSubtitle: {
    fontSize: 30,
    color: "#666",
    // textAlign: "center",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  whatsappButton: {
    flex: 1,
    backgroundColor: "#109e38",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    // paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  optionsButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E5E5",
    gap: 8,
  },
  optionsButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "500",
  },
});
