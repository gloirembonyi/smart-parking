import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { Button, Card, Title, TextInput, Text } from "react-native-paper";
import { RootStackParamList } from "../navigation/AppNavigator";

type BookingRouteProp = RouteProp<RootStackParamList, "Booking">;

export default function BookingScreen() {
  const route = useRoute<BookingRouteProp>();
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleBooking = () => {
    // In a real app, this would make an API call to book the spot
    console.log("Booking details:", {
      parkingId: route.params.parkingId,
      date,
      startTime,
      duration,
      vehicleNumber,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Book a Parking Spot</Title>

          <TextInput
            label="Date"
            value={date}
            onChangeText={setDate}
            style={styles.input}
            placeholder="MM/DD/YYYY"
          />

          <TextInput
            label="Start Time"
            value={startTime}
            onChangeText={setStartTime}
            style={styles.input}
            placeholder="HH:MM"
          />

          <TextInput
            label="Duration (hours)"
            value={duration}
            onChangeText={setDuration}
            style={styles.input}
            keyboardType="numeric"
          />

          <TextInput
            label="Vehicle Number"
            value={vehicleNumber}
            onChangeText={setVehicleNumber}
            style={styles.input}
            placeholder="Enter vehicle number"
          />

          <View style={styles.summary}>
            <Text style={styles.summaryText}>Booking Summary</Text>
            <Text>Parking ID: {route.params.parkingId}</Text>
            <Text>Date: {date}</Text>
            <Text>Time: {startTime}</Text>
            <Text>Duration: {duration} hours</Text>
            <Text>Vehicle: {vehicleNumber}</Text>
            {/* In a real app, we would calculate and display the total cost */}
          </View>

          <Button
            mode="contained"
            onPress={handleBooking}
            style={styles.button}
            disabled={!date || !startTime || !duration || !vehicleNumber}
          >
            Confirm Booking
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  card: {
    margin: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  summary: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
});
