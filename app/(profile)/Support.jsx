import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

const HelpAndSupport = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  // Sample active tickets data
  const activeTickets = [
    {
      id: "1",
      title: "Payment Issue",
      status: "In Progress",
      lastUpdate: "2 hours ago",
    },
    {
      id: "2",
      title: "Account Access",
      status: "Pending",
      lastUpdate: "1 day ago",
    },
  ];

  // Sample FAQ data
  const faqData = [
    {
      id: "1",
      question: "How do I reset my password?",
      answer:
        'You can reset your password by going to the login screen and clicking on "Forgot Password". Follow the instructions sent to your email.',
    },
    {
      id: "2",
      question: "How do I track my order?",
      answer:
        'To track your order, go to "My Orders" section and click on the specific order. You will find the tracking information there.',
    },
    {
      id: "3",
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, PayPal, and various digital wallets including Apple Pay and Google Pay.",
    },
  ];

  // Sample topics
  const topics = [
    "Account & Security",
    "Payments & Billing",
    "Orders & Shipping",
    "Returns & Refunds",
    "Technical Support",
  ];

  const renderTicketItem = ({ item }) => (
    <TouchableOpacity style={styles.ticketItem}>
      <View style={styles.ticketHeader}>
        <MaterialIcons name="confirmation-number" size={24} color="#881b20" />
        <Text style={styles.ticketTitle}>{item.title}</Text>
        <Text
          style={[
            styles.ticketStatus,
            { color: item.status === "In Progress" ? "#007AFF" : "#FFA500" },
          ]}
        >
          {item.status}
        </Text>
      </View>
      <Text style={styles.ticketUpdate}>Last updated: {item.lastUpdate}</Text>
    </TouchableOpacity>
  );

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const renderFaqItem = ({ item }) => (
    <TouchableOpacity style={styles.faqItem} onPress={() => toggleFaq(item.id)}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.question}</Text>
        <MaterialIcons
          name={
            expandedFaq === item.id
              ? "keyboard-arrow-up"
              : "keyboard-arrow-down"
          }
          size={24}
          color="#666"
        />
      </View>
      {expandedFaq === item.id && (
        <Text style={styles.faqAnswer}>{item.answer}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Active Tickets</Text>
      <FlatList
        data={activeTickets}
        renderItem={renderTicketItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <TouchableOpacity style={styles.pastTicketsButton}>
        <MaterialCommunityIcons name="history" size={24} color="#881b20" />
        <Text style={styles.pastTicketsText}>View Past Tickets</Text>
        <MaterialIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      <FlatList
        data={faqData}
        renderItem={renderFaqItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />

      <Text style={styles.sectionTitle}>Browse Topics</Text>
      <View style={styles.topicsContainer}>
        {topics.map((topic, index) => (
          <TouchableOpacity key={index} style={styles.topicItem}>
            <FontAwesome5 name="book-open" size={20} color="#881b20" />
            <Text style={styles.topicText}>{topic}</Text>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.contactSupport}>
        <Ionicons name="headset" size={24} color="#fff" />
        <Text style={styles.contactSupportText}>Contact Support</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 16,
    color: "#333",
  },
  ticketItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ticketHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginLeft: 12,
    color: "#333",
  },
  ticketStatus: {
    fontSize: 14,
    fontWeight: "500",
  },
  ticketUpdate: {
    fontSize: 14,
    color: "#666",
    marginLeft: 36,
  },
  faqItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    marginRight: 8,
    color: "#333",
  },
  faqAnswer: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  topicsContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  topicItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  topicText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    color: "#333",
  },
  pastTicketsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  pastTicketsText: {
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
    color: "#333",
  },
  contactSupport: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#881b20",
    padding: 8,
    borderRadius: 8,
    marginVertical: 24,
    marginHorizontal: 60,
    marginBottom: 50,
  },
  contactSupportText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
});

export default HelpAndSupport;
