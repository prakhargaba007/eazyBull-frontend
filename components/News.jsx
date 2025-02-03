import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

const DUMMY_NEWS = [
  {
    id: "1",
    title: "Bitcoin Reaches New All-Time ",
    description:
      "Bitcoin surpasses previous records as institutional investors continue to show strong interest in the leading cryptocurrency.",
    time: "2 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "2",
    title: "Ethereum 2.0 Upgrade Successfully Completed",
    description:
      "The long-awaited upgrade brings improved scalability and reduced energy consumption to the Ethereum network.",
    time: "3 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "3",
    title: "Major Bank Launches Crypto Trading Platform",
    description:
      "Leading financial institution announces new cryptocurrency trading services for institutional clients.",
    time: "5 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "4",
    title: "New DeFi Protocol Gains Traction",
    description:
      "Innovative decentralized finance platform sees rapid adoption as total value locked exceeds $1 billion.",
    time: "6 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "5",
    title: "Crypto Regulation Framework Proposed",
    description:
      "Government officials unveil new regulatory guidelines for cryptocurrency exchanges and digital assets.",
    time: "8 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "6",
    title: "NFT Market Shows Signs of Recovery",
    description:
      "Digital art and collectibles marketplace sees increased trading volume after months of decline.",
    time: "10 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "7",
    title: "New Layer 2 Solution Launches",
    description:
      "Innovative scaling solution promises faster and cheaper transactions for blockchain networks.",
    time: "12 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "8",
    title: "Crypto Mining Company Goes Public",
    description:
      "Major cryptocurrency mining operation completes successful IPO on stock exchange.",
    time: "14 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "9",
    title: "Central Bank Digital Currency Trial",
    description:
      "National bank begins testing digital currency implementation with selected participants.",
    time: "16 hours ago",
    image: "https://picsum.photos/300/200",
  },
  {
    id: "10",
    title: "Crypto Adoption in Emerging Markets",
    description:
      "Study shows significant increase in cryptocurrency usage across developing economies.",
    time: "18 hours ago",
    image: "https://picsum.photos/300/200",
  },
];

const api = {
  fetchNews: async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return DUMMY_NEWS;
    } catch (error) {
      throw new Error("Failed to fetch news");
    }
  },
};

const CryptoNewsFeed = () => {
  const [showAllNews, setShowAllNews] = useState(false);
  const [news, setNews] = useState(DUMMY_NEWS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const displayedNews = showAllNews ? news : news.slice(0, 5);

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.fetchNews();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await fetchNews();
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderNewsItem = ({ item }) => (
    <View style={styles.newsItem}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.contentContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {item.description}
        </Text>
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </View>
  );

  const ListFooterComponent = () => (
    <TouchableOpacity
      style={styles.viewMoreButton}
      onPress={() => setShowAllNews(!showAllNews)}
    >
      <Text style={styles.viewMoreText}>
        {showAllNews ? "Show Less" : "View More"}
      </Text>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
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
        <TouchableOpacity style={styles.retryButton} onPress={fetchNews}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedNews}
        renderItem={renderNewsItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={ListFooterComponent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#881b20"]}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  listContainer: {
    padding: 16,
  },
  newsItem: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    lineHeight: 20,
  },
  time: {
    fontSize: 12,
    color: "#999",
  },
  viewMoreButton: {
    backgroundColor: "#881b20",
    padding: 16,
    marginVertical: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  viewMoreText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#881b20",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default CryptoNewsFeed;
