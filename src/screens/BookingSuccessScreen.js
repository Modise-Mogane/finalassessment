import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import images from "../../assets/images";
import theme from "../theme";

const BookingSuccessScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image source={images.bookingSuccess.vector} style={styles.successIcon} />
      <Text style={styles.title}>Booking Successful!</Text>
      <Text style={styles.message}>
        Your hotel reservation has been confirmed. You can view your booking
        details in your profile.
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate("TabNavigator", { screen: "Profile" })
          }
        >
          <Text style={styles.buttonText}>View Booking</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.exploreButton]}
          onPress={() =>
            navigation.navigate("TabNavigator", { screen: "Explore" })
          }
        >
          <Text style={styles.buttonText}>Continue Exploring</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 10,
  },
  successIcon: {
    width: 100,
    height: 100,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#666",
    marginBottom: 40,
  },
  buttonContainer: {
    width: "100%",
  },
  button: {
    backgroundColor: theme.colors.accent2,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  exploreButton: {
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default BookingSuccessScreen;
