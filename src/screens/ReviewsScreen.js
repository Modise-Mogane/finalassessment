import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { auth, db } from "../services/firebase";
import images from "../../assets/images";
import theme from "../theme";
import { collection, query, where, getDocs } from "firebase/firestore";

const ReviewsScreen = ({ route, navigation }) => {
  const { hotelId } = route.params;
  const [reviews, setReviews] = useState([]);
  const [hasReviewed, setHasReviewed] = useState(false);

  const fetchReviews = async () => {
    try {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("hotelId", "==", hotelId)
      );
      const querySnapshot = await getDocs(reviewsQuery);
      const reviewsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(reviewsList);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const checkUserReview = async () => {
    try {
      const userReviewQuery = query(
        collection(db, "reviews"),
        where("hotelId", "==", hotelId),
        where("userId", "==", auth.currentUser.uid)
      );
      const querySnapshot = await getDocs(userReviewQuery);
      setHasReviewed(!querySnapshot.empty);
    } catch (error) {
      console.error("Error checking user review:", error);
    }
  };

  useEffect(() => {
    fetchReviews();
    checkUserReview();
    const unsub = navigation.addListener("focus", () => {
      fetchReviews();
      checkUserReview();
    });
    return unsub;
  }, [navigation]);

  const renderReview = ({ item }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Text style={styles.userName}>{item.userEmail}</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Image
              key={star}
              source={images.explore.star}
              style={[
                styles.starIcon,
                { tintColor: star <= item.rating ? "#FFD700" : "#ddd" },
              ]}
            />
          ))}
        </View>
      </View>
      <Text style={styles.reviewText}>{item.text}</Text>
      <Text style={styles.dateText}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {!hasReviewed && (
        <TouchableOpacity
          style={styles.addReviewButton}
          onPress={() => navigation.navigate("AddReview", { hotelId })}
        >
          <Text style={styles.addReviewButtonText}>Add Review</Text>
        </TouchableOpacity>
      )}

      {reviews.length > 0 ? (
        <FlatList
          data={reviews}
          renderItem={renderReview}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.reviewsList}
          keyboardShouldPersistTaps="handled"
        />
      ) : (
        <Text style={styles.noReviewsText}>No reviews yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 10,
  },
  addReviewButton: {
    backgroundColor: theme.colors.primary,
    margin: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  addReviewButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  reviewCard: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  userName: {
    fontWeight: "bold",
  },
  ratingContainer: {
    flexDirection: "row",
  },
  starIcon: {
    width: 16,
    height: 16,
    marginLeft: 2,
  },
  reviewText: {
    marginBottom: 8,
  },
  dateText: {
    color: "#666",
    fontSize: 12,
  },
  noReviewsText: {
    textAlign: "center",
    marginTop: 20,
    color: theme.colors.muted,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    padding: 16,
    borderRadius: 8,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  ratingSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  reviewInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  cancelButtonText: {
    color: "#000",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ReviewsScreen;
