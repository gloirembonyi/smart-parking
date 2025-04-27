import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import { HomeScreen } from "../screens/HomeScreen";
import { ParkingDetailsScreen } from "../screens/ParkingDetailsScreen";
import { BookingScreen } from "../screens/BookingScreen";
import { ProfileScreen } from "../screens/ProfileScreen";

export type RootStackParamList = {
  Home: undefined;
  ParkingDetails: { id: string };
  Booking: { parkingId: string };
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Smart Parking" }}
        />
        <Stack.Screen
          name="ParkingDetails"
          component={ParkingDetailsScreen}
          options={{ title: "Parking Details" }}
        />
        <Stack.Screen
          name="Booking"
          component={BookingScreen}
          options={{ title: "Book a Spot" }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{ title: "My Profile" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
