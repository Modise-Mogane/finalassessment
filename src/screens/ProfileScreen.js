import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { auth, db } from "../services/firebase";
import theme from "../theme";
import images from "../../assets/images";
import { signOut } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

const ProfileScreen = ({ navigation }) => {
  const [userBookings, setUserBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchUserBookings();
  }, []);

  const fetchUserBookings = async () => {
    try {
      const bookingsQuery = query(
        collection(db, "bookings"),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(bookingsQuery);
      const bookings = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserBookings(bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert(
        "Permission Required",
        "Please allow access to your photo library"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
    }
  };

  const renderBookingCard = (booking) => (
    <View key={booking.id} style={styles.bookingCard}>
      <Text style={styles.hotelName}>{booking.hotelName}</Text>
      <View style={styles.bookingDetails}>
        <Text style={styles.dateText}>
          Check-in: {new Date(booking.checkIn).toLocaleDateString()}
        </Text>
        <Text style={styles.dateText}>
          Check-out: {new Date(booking.checkOut).toLocaleDateString()}
        </Text>
      </View>
      <Text style={styles.price}>Total: ${booking.totalPrice}</Text>
      <Text
        style={[
          styles.status,
          { color: booking.status === "confirmed" ? "green" : "orange" },
        ]}
      >
        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
      </Text>
    </View>
  );

  const displayName =
    auth.currentUser?.displayName || auth.currentUser?.email?.split("@")[0];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handlePickImage}>
          <Image
            source={
              profileImage ? { uri: profileImage } : images.account.profile1
            }
            style={styles.profileImage}
          />
          <View style={styles.editIconContainer}>
            <Text style={styles.editIcon}>✎</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{displayName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>My Bookings</Text>
        {loading ? (
          <Text style={styles.loadingText}>Loading bookings...</Text>
        ) : userBookings.length > 0 ? (
          userBookings.map(renderBookingCard)
        ) : (
          <Text style={styles.noBookingsText}>No bookings yet</Text>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: "#000",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  editIcon: {
    color: "#fff",
    fontSize: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    color: theme.colors.text,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: theme.colors.text,
  },
  bookingCard: {
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookingDetails: {
    marginBottom: 10,
  },
  dateText: {
    color: "#666",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  status: {
    fontWeight: "bold",
  },
  loadingText: {
    textAlign: "center",
    color: theme.colors.muted,
    marginTop: 20,
  },
  noBookingsText: {
    textAlign: "center",
    color: theme.colors.muted,
    marginTop: 20,
  },
  logoutButton: {
    backgroundColor: theme.colors.primary,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
