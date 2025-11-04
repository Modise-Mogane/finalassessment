import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { auth, db } from "../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import theme from "../theme";

const AddReviewScreen = ({ route, navigation }) => {
  const { hotelId } = route.params;
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5);

  const handleSubmit = async () => {
    if (newReview.trim().length === 0) {
      Alert.alert("Error", "Please enter a review");
      return;
    }

    try {
      const reviewData = {
        hotelId,
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        rating,
        text: newReview,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "reviews"), reviewData);
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to add review. Please try again.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.inner}>
          <Text style={styles.title}>Write a Review</Text>

          <View style={styles.ratingRow}>
            <Text style={styles.label}>Rating:</Text>
            {[1, 2, 3, 4, 5].map((s) => (
              <TouchableOpacity key={s} onPress={() => setRating(s)}>
                <Text
                  style={[styles.star, s <= rating && { color: "#FFD700" }]}
                >
                  ★
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="Write your review here..."
            placeholderTextColor={theme.colors.muted}
            value={newReview}
            onChangeText={setNewReview}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            autoFocus
          />

          <View style={styles.buttonsRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 10,
  },
  inner: { flex: 1, padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: theme.colors.text,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  label: { marginRight: 8, color: theme.colors.text },
  star: { fontSize: 24, color: "#ccc", marginHorizontal: 4 },
  input: {
    height: 180,
    width: "90%",
    alignSelf: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    color: theme.colors.text,
    marginVertical: 12,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    width: "90%",
    alignSelf: "center",
  },
  cancelBtn: {
    flex: 1,
    marginRight: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.muted,
    alignItems: "center",
  },
  submitBtn: {
    flex: 1,
    marginLeft: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
  },
  cancelText: { color: "#000" },
  submitText: { color: theme.colors.text, fontWeight: "bold" },
});

export default AddReviewScreen;
