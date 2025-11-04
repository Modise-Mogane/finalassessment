import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import images from "../../assets/images";
import theme from "../theme";

const onboardingData = [
  {
    id: 1,
    title: "Find Perfect Hotels",
    description:
      "Discover the perfect accommodation for your next trip with our curated selection of hotels.",
    image: images.onboarding.onboarding1,
  },
  {
    id: 2,
    title: "Easy Booking",
    description:
      "Book your favorite hotels with just a few taps and get instant confirmation.",
    image: images.onboarding.onboarding2,
  },
  {
    id: 3,
    title: "Great Experience",
    description:
      "Enjoy your stay with comfort and create memorable experiences.",
    image: images.onboarding.onboarding3,
  },
];

const OnboardingScreen = ({ navigation }) => {
  const [currentScreen, setCurrentScreen] = React.useState(0);

  const handleNext = async () => {
    if (currentScreen < onboardingData.length - 1) {
      setCurrentScreen((prev) => prev + 1);
    } else {
      await AsyncStorage.setItem("@onboarding_completed", "true");
      navigation.replace("SignIn");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={onboardingData[currentScreen].image}
        style={styles.image}
      />
      <View style={styles.content}>
        <Text style={styles.title}>{onboardingData[currentScreen].title}</Text>
        <Text style={styles.description}>
          {onboardingData[currentScreen].description}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {onboardingData.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === currentScreen && styles.paginationDotActive,
              ]}
            />
          ))}
        </View>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>
            {currentScreen === onboardingData.length - 1
              ? "Get Started"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "50%",
    resizeMode: "contain",
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: theme.colors.text,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    color: theme.colors.muted,
  },
  footer: {
    padding: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  paginationDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ccc",
    marginHorizontal: 5,
  },
  paginationDotActive: {
    backgroundColor: "#000",
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OnboardingScreen;
