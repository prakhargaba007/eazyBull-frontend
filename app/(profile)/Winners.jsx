import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import TopButtons from "../../components/TopButtons";
import { images } from "../../assets/images/assets";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const itemIcons = {
  Bitcoin: "bitcoin",
  Ethereum: "ethereum",
  Ripple: "alpha-x-circle",
  Litecoin: "litecoin",
  Gold: "gold",
  Silver: "podium-silver",
  Platinum: "alpha-p-circle",
  Palladium: "alpha-p-box",
  "S&P 500": "chart-bar",
  Nasdaq: "chart-bell-curve",
  "Nikkei 225": "chart-areaspline",
};

const WinnerCard = ({ item }) => (
  <View style={styles.winnerContainer}>
    <View style={styles.content}>
      <View style={styles.leftContent}>
        {/* Bitcoin Logo */}
        <View style={styles.x}>
          {/* <View style={styles.bitcoinLogo}>
              <Text style={styles.bitcoinSymbol}>₿</Text>
            </View> */}
          <MaterialCommunityIcons
            name={itemIcons[item.title] || "help-circle"}
            size={50}
            //   color="#333"
            style={styles.itemIcon}
          />
          <Text style={styles.bitcoinText}>{item.title}</Text>
        </View>
      </View>
      <View style={styles.textContainer}>
        <View style={styles.timeContainer}>
          <Text style={styles.startsInText}>Ends</Text>
          <Text style={styles.timeText}>{item.timeAgo}</Text>
        </View>
      </View>

      {/* Right Content */}
      <View style={styles.rightContent}>
        <Text style={styles.btcText}>BTC</Text>
        {/* <Text style={styles.priceText}>$97,944.28</Text> 
          <Text style={styles.percentageText}>0.37% (1d)</Text> */}
      </View>
    </View>
    <View style={styles.y}>
      <View style={styles.z}></View>
      <Text style={styles.priceText}>$97,944.28</Text>
    </View>

    <Text style={styles.prizeText}>₹ {item.prize} Crores</Text>

    <View style={styles.winnersGrid}>
      {item.winners.map((winner, index) => (
        <View key={index} style={styles.winnerCard}>
          <View style={{ padding: 5 }}>
            <Text style={styles.rankText}>Rank# {winner.rank}</Text>
            <Text style={styles.winnerName} numberOfLines={1}>
              {winner.name}
            </Text>
          </View>
          <Image source={{ uri: winner.avatar }} style={styles.winnerAvatar} />
          <Text style={styles.winningAmount}>Won {winner.amount} Lakhs</Text>
        </View>
      ))}
    </View>
  </View>
);

const Winners = () => {
  const [selectedMode, setSelectedMode] = useState("Bullet");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sample static data
  const mockData = [
    {
      id: "2",
      timeAgo: "90mins ago",
      price: "97,944.28",
      change: "0.37% (1d)",
      prize: "2.50",
      title: "Bitcoin",
      winners: [
        {
          rank: 1,
          name: "Akhara Wanderers",
          avatar: "https://placeholder.com/150",
          amount: "2.50",
        },
        {
          rank: 2,
          name: "Akhara Wanderers",
          avatar: "https://placeholder.com/150",
          amount: "2.50",
        },
        {
          rank: 3,
          name: "jai pari and pari",
          avatar: "https://placeholder.com/150",
          amount: "2.50",
        },
      ],
    },
    {
      id: "1",
      timeAgo: "15mins ago",
      price: "97,944.28",
      change: "0.37% (1d)",
      prize: "2.50",
      title: "Ethereum",
      winners: [
        {
          rank: 1,
          name: "Akhara Wanderers",
          avatar: "https://placeholder.com/150",
          amount: "2.50",
        },
        {
          rank: 2,
          name: "Akhara Wanderers",
          avatar: "https://placeholder.com/150",
          amount: "2.50",
        },
        {
          rank: 3,
          name: "jai pari and pari",
          avatar: "https://placeholder.com/150",
          amount: "2.50",
        },
      ],
    },
    // Add more mock data items here
  ];

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate network request
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // In real implementation, replace this with actual API call
        // const response = await fetch('your-api-endpoint');
        // const json = await response.json();

        setData(mockData);
        setError(null);
      } catch (err) {
        setError("Failed to fetch winners data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#881b20" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopButtons
        setSelectedMode={setSelectedMode}
        selectedMode={selectedMode}
      />
      <Text style={styles.title}>Contest Winners</Text>
      <Text style={styles.subTitle}>Recent Mega Matches</Text>
      <FlatList
        data={data}
        renderItem={({ item }) => <WinnerCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Winners;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    padding: 10,
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
  },
  listContainer: {
    padding: 16,
  },
  winnerContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    // padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cryptoInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cryptoIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  cryptoName: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  endsText: {
    color: "red",
    marginRight: 8,
  },
  timeAgo: {
    color: "#666",
  },
  priceInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  btcText: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  changeText: {
    color: "green",
  },
  prizeText: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  winnersGrid: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  winnerCard: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    // padding: 8,
    marginHorizontal: 4,
    // alignItems: "center",
  },
  rankText: {
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  winnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 4,
  },
  winnerName: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 4,
  },
  winningAmount: {
    fontSize: 10,
    color: "green",
    fontWeight: "500",
    backgroundColor: "#ddedf3",
    textAlign: "center",
    padding: 2,
    borderRadius: 8,
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  bitcoinLogo: {
    width: 40,
    height: 40,
    backgroundColor: "#F7931A",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  bitcoinSymbol: {
    color: "white",
    fontSize: 24,
  },
  textContainer: {
    justifyContent: "center",
  },
  bitcoinText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  x: {
    display: "flex",
    // justifyContent: "center",
    // alignItems: "center",
  },
  timeContainer: {
    // flexDirection: "row",
    alignItems: "center",
  },
  startsInText: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  timeText: {
    fontSize: 14,
    color: "#E53935",
  },
  rightContent: {
    alignItems: "flex-end",
  },
  btcText: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 4,
    marginRight: 28,
    borderBottomColor: "gray",
    borderBottomWidth: 2,
    borderRadius: 2,
  },
  y: {
    flexDirection: "row",
    alignItems: "center",
  },
  z: {
    flex: 1,
    height: 3,
    backgroundColor: "#881b20",
    borderRadius: 50,
  },
  priceText: {
    fontSize: 18,
    fontWeight: "bold",
    // marginBottom: 4,
    marginLeft: 8,
    marginRight: 15,
  },
  percentageText: {
    fontSize: 14,
    color: "#666",
  },
});
