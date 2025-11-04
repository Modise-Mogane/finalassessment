import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { auth } from "../services/firebase";
import theme from "../theme";

import OnboardingScreen from "../screens/OnboardingScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen";
import ExploreScreen from "../screens/ExploreScreen";
import DealsScreen from "../screens/DealsScreen";
import BookingsScreen from "../screens/BookingsScreen";
import HotelDetailsScreen from "../screens/HotelDetailsScreen";
import BookingScreen from "../screens/BookingScreen";
import BookingSuccessScreen from "../screens/BookingSuccessScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddReviewScreen from "../screens/AddReviewScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Onboarding" component={OnboardingScreen} />
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={{
      tabBarActiveTintColor: theme.colors.accent2, 
      tabBarInactiveTintColor: "#666",
      tabBarStyle: { backgroundColor: "#000" }, 
      headerShown: false,
    }}
  >
    <Tab.Screen
      name="Explore"
      component={ExploreScreen}
      options={{
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Bookings"
      component={BookingsScreen}
      options={{ headerShown: false }}
    />
    <Tab.Screen
      name="Deals"
      component={DealsScreen}
      options={{
        headerShown: false,
      }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{
        headerShown: false,
      }}
    />
  </Tab.Navigator>
);


const MainStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="TabNavigator"
      component={TabNavigator}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="HotelDetails"
      component={HotelDetailsScreen}
      options={{
        title: "Hotel Details",
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="Booking"
      component={BookingScreen}
      options={{
        title: "Book Room",
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="BookingSuccess"
      component={BookingSuccessScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Reviews"
      component={ReviewsScreen}
      options={{
        title: "Reviews",
        headerBackTitleVisible: false,
      }}
    />
    <Stack.Screen
      name="AddReview"
      component={AddReviewScreen}
      options={{ title: "Add Review", headerBackTitleVisible: false }}
    />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
    });

    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      {!isAuthenticated ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
