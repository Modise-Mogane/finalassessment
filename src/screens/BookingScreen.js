import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import theme from "../theme";
import { auth, db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";

const BookingScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date(Date.now() + 86400000)); // Tomorrow
  const [numRooms, setNumRooms] = useState(1);
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);

  const calculateTotalNights = () => {
    const diffTime = Math.abs(checkOut - checkIn);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotalPrice = () => {
    return hotel.price * numRooms * calculateTotalNights();
  };

  const handleConfirmBooking = async () => {
    try {
      const bookingData = {
        hotelId: hotel.id,
        hotelName: hotel.name,
        userId: auth.currentUser.uid,
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        numRooms,
        totalPrice: calculateTotalPrice(),
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, "bookings"), bookingData);

      Alert.alert(
        "Booking Confirmed!",
        "Your booking has been successfully confirmed.",
        [
          {
            text: "OK",
            onPress: () =>
              navigation.navigate("BookingSuccess", { bookingId: docRef.id }),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to confirm booking. Please try again.");
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Selected Hotel</Text>
        <View style={styles.hotelInfo}>
          <Text style={styles.hotelName}>{hotel.name}</Text>
          <Text style={styles.hotelLocation}>{hotel.location}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Dates</Text>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowCheckIn(true)}
        >
          <Text style={styles.dateButtonText}>
            Check-in: {checkIn.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowCheckOut(true)}
        >
          <Text style={styles.dateButtonText}>
            Check-out: {checkOut.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showCheckIn && (
          <DateTimePicker
            value={checkIn}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              setShowCheckIn(false);
              if (selectedDate) {
                setCheckIn(selectedDate);
                if (selectedDate >= checkOut) {
                  setCheckOut(new Date(selectedDate.getTime() + 86400000));
                }
              }
            }}
          />
        )}

        {showCheckOut && (
          <DateTimePicker
            value={checkOut}
            mode="date"
            display="default"
            minimumDate={new Date(checkIn.getTime() + 86400000)}
            onChange={(event, selectedDate) => {
              setShowCheckOut(false);
              if (selectedDate) {
                setCheckOut(selectedDate);
              }
            }}
          />
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Number of Rooms</Text>
        <View style={styles.roomSelector}>
          <TouchableOpacity
            style={styles.roomButton}
            onPress={() => numRooms > 1 && setNumRooms(numRooms - 1)}
          >
            <Text style={styles.roomButtonText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.roomCount}>{numRooms}</Text>
          <TouchableOpacity
            style={styles.roomButton}
            onPress={() => setNumRooms(numRooms + 1)}
          >
            <Text style={styles.roomButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price Details</Text>
        <View style={styles.priceRow}>
          <Text>Room Rate</Text>
          <Text>${hotel.price} / night</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Number of Nights</Text>
          <Text>{calculateTotalNights()} nights</Text>
        </View>
        <View style={styles.priceRow}>
          <Text>Number of Rooms</Text>
          <Text>{numRooms} rooms</Text>
        </View>
        <View style={[styles.priceRow, styles.totalRow]}>
          <Text style={styles.totalText}>Total</Text>
          <Text style={styles.totalPrice}>${calculateTotalPrice()}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.confirmButton}
        onPress={handleConfirmBooking}
      >
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 10,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 20,
  },
  section: {
    padding: 16,
    width: "95%",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  hotelInfo: {
    marginBottom: 8,
  },
  hotelName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  hotelLocation: {
    color: theme.colors.muted,
  },
  dateButton: {
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateButtonText: {
    fontSize: 16,
  },
  roomSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  roomButton: {
    backgroundColor: "#f0f0f0",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  roomButtonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  roomCount: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: theme.colors.primary,
  },
  confirmButton: {
    backgroundColor: theme.colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingScreen;
