import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { fetchRecommendedHotels } from "../services/apiService";
import images from "../../assets/images";
import theme from "../theme";

const DealCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={item.mainImage} style={styles.image} />
    <View style={styles.content}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.location}>{item.location}</Text>
      <View style={styles.row}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={images.explore.star} style={styles.starIcon} />
          <Text style={styles.rating}>{item.rating}</Text>
        </View>
        <Text style={styles.price}>${item.price}/night</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const DealsScreen = ({ navigation }) => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDeals = async (showLoading = true) => {
    if (showLoading) setLoading(true);
    setError(null);
    try {
      const hotels = await fetchRecommendedHotels();
      setDeals(hotels);
    } catch (err) {
      console.error(err);
      setError("Failed to load deals");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDeals();
  }, []);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Loading deals...</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => loadDeals()}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={deals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DealCard
              item={item}
              onPress={() =>
                navigation.navigate("HotelDetails", { hotel: item })
              }
            />
          )}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadDeals(false);
              }}
            />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, color: "#666" },
  errorText: { color: "#ff4444", marginBottom: 12 },
  retryButton: { backgroundColor: "#000", padding: 10, borderRadius: 8 },
  retryText: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  image: { width: "100%", height: 180, resizeMode: "cover" },
  content: { padding: 12 },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  location: { color: "#666", marginBottom: 8 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  starIcon: { width: 16, height: 16, tintColor: "#FFD700", marginRight: 6 },
  rating: { color: "#666", marginRight: 8 },
  price: { fontWeight: "bold", color: "#000" },
});

export default DealsScreen;
