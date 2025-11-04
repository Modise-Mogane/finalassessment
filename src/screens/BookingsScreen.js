import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { auth, db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import theme from "../theme";

const BookingsScreen = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserBookings = async () => {
      setLoading(true);
      try {
        const bookingsQuery = query(
          collection(db, "bookings"),
          where("userId", "==", auth.currentUser.uid)
        );
        const qs = await getDocs(bookingsQuery);
        const data = qs.docs.map((d) => ({ id: d.id, ...d.data() }));
        setBookings(data);
      } catch (e) {
        console.error("Failed to fetch bookings", e);
      } finally {
        setLoading(false);
      }
    };

    if (auth.currentUser) fetchUserBookings();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loading}>Loading bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>My Bookings</Text>
      {bookings.length === 0 ? (
        <Text style={styles.empty}>You have no bookings yet.</Text>
      ) : (
        bookings.map((b) => (
          <View key={b.id} style={styles.card}>
            <Text style={styles.hotelName}>{b.hotelName}</Text>
            <Text style={styles.dates}>
              Check-in: {new Date(b.checkIn).toLocaleDateString()}
            </Text>
            <Text style={styles.dates}>
              Check-out: {new Date(b.checkOut).toLocaleDateString()}
            </Text>
            <Text style={styles.price}>Total: ${b.totalPrice}</Text>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  content: { padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.primary,
    marginBottom: 12,
  },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { marginTop: 8, color: theme.colors.muted },
  empty: { color: theme.colors.muted, textAlign: "center", marginTop: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.accent,
  },
  hotelName: { fontWeight: "700", fontSize: 16 },
  dates: { color: theme.colors.muted },
  price: { marginTop: 6, fontWeight: "700", color: theme.colors.primary },
});

export default BookingsScreen;
