import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { auth } from "../services/firebase";
import images from "../../assets/images";
import { fetchWeatherForLocation } from "../services/apiService";
import theme from "../theme";

const ReviewCard = ({ review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <Image
        source={images.hotelDetail.profile1}
        style={styles.reviewerImage}
      />
      <View>
        <Text style={styles.reviewerName}>{review.userName}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              key={star}
              source={images.explore.star}
              style={[
                styles.starIcon,
                { tintColor: star <= review.rating ? "#FFD700" : "#ddd" },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
    <Text style={styles.reviewText}>{review.text}</Text>
  </View>
);

const HotelDetailsScreen = ({ route, navigation }) => {
  const { hotel } = route.params;
  const [selectedImage, setSelectedImage] = useState(0);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  const mockReviews = [
    {
      id: "1",
      userName: "John Smith",
      rating: 5,
      text: "Amazing hotel with great amenities and friendly staff.",
    },
    {
      id: "2",
      userName: "Jane Smith",
      rating: 4,
      text: "Very comfortable stay, would recommend!",
    },
  ];

  const handleBookNow = () => {
    if (!auth.currentUser) {
      navigation.navigate("SignIn");
      return;
    }
    navigation.navigate("Booking", { hotel });
  };

  useEffect(() => {
    const loadWeather = async () => {
      if (!hotel?.coords) return;
      setWeatherLoading(true);
      try {
        const w = await fetchWeatherForLocation(
          hotel.coords.lat,
          hotel.coords.lon
        );
        setWeather(w);
      } catch (e) {
        console.error("Failed to fetch weather", e);
      } finally {
        setWeatherLoading(false);
      }
    };

    loadWeather();
  }, [hotel]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={
            selectedImage === 0
              ? images.hotelDetail.frame1
              : selectedImage === 1
              ? images.hotelDetail.frame2
              : selectedImage === 2
              ? images.hotelDetail.frame3
              : images.hotelDetail.frame4
          }
          style={styles.mainImage}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.thumbnailContainer}
        >
          <TouchableOpacity onPress={() => setSelectedImage(0)}>
            <Image
              source={images.hotelDetail.frame1}
              style={[
                styles.thumbnail,
                selectedImage === 0 && styles.selectedThumbnail,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedImage(1)}>
            <Image
              source={images.hotelDetail.frame2}
              style={[
                styles.thumbnail,
                selectedImage === 1 && styles.selectedThumbnail,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedImage(2)}>
            <Image
              source={images.hotelDetail.frame3}
              style={[
                styles.thumbnail,
                selectedImage === 2 && styles.selectedThumbnail,
              ]}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedImage(3)}>
            <Image
              source={images.hotelDetail.frame4}
              style={[
                styles.thumbnail,
                selectedImage === 3 && styles.selectedThumbnail,
              ]}
            />
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.hotelName}>{hotel.name}</Text>
        <View style={styles.locationContainer}>
          <Image source={images.explore.mapPin} style={styles.locationIcon} />
          <Text style={styles.location}>{hotel.location}</Text>
        </View>
        {weatherLoading ? (
          <Text style={{ marginVertical: 8, color: "#666" }}>
            Loading weather...
          </Text>
        ) : weather ? (
          <View style={styles.weatherRow}>
            <Image
              source={{
                uri: `https://openweathermap.org/img/wn/${weather.icon}@2x.png`,
              }}
              style={styles.weatherIcon}
            />
            <View>
              <Text style={styles.weatherTemp}>
                {Math.round(weather.temperature)}°C
              </Text>
              <Text style={styles.weatherCond}>{weather.condition}</Text>
            </View>
          </View>
        ) : null}
        <View style={styles.ratingContainer}>
          <Image source={images.explore.star} style={styles.starIcon} />
          <Text style={styles.rating}>{hotel.rating}</Text>
        </View>
        <Text style={styles.price}>${hotel.price}/night</Text>

        <Text style={styles.description}>
          {hotel.description ||
            "Experience luxury and comfort in our well-appointed rooms with modern amenities and spectacular views."}
        </Text>

        <View style={styles.reviewsSection}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsTitle}>Reviews</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Reviews", { hotelId: hotel.id })
              }
            >
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={mockReviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <ReviewCard review={item} />}
            scrollEnabled={false}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
        <Text style={styles.bookButtonText}>Book Now</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 300,
  },
  mainImage: {
    width: "100%",
    height: 250,
  },
  thumbnailContainer: {
    position: "absolute",
    bottom: 10,
    paddingHorizontal: 16,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 8,
  },
  selectedThumbnail: {
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoContainer: {
    padding: 16,
  },
  hotelName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  location: {
    color: "#666",
  },
  weatherRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  weatherIcon: {
    width: 48,
    height: 48,
    marginRight: 12,
  },
  weatherTemp: {
    fontSize: 16,
    fontWeight: "bold",
  },
  weatherCond: {
    color: "#666",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  starIcon: {
    width: 16,
    height: 16,
    marginRight: 4,
  },
  rating: {
    color: "#FFD700",
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 16,
  },
  description: {
    color: "#666",
    lineHeight: 24,
    marginBottom: 24,
  },
  reviewsSection: {
    marginTop: 16,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  reviewsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAllText: {
    color: "#000",
    textDecorationLine: "underline",
  },
  reviewCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewerImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerName: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  reviewText: {
    color: "#444",
    lineHeight: 20,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  bookButtonText: {
    color: theme.colors.background,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default HotelDetailsScreen;
