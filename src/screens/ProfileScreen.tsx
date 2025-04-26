import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Avatar,
  Card,
  Title,
  Paragraph,
  List,
  Button,
} from "react-native-paper";

// Mock user data - in a real app, this would come from an API or local storage
const mockUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 234 567 8900",
  vehicle: "ABC 123",
  bookings: [
    {
      id: "1",
      parkingName: "Downtown Parking",
      date: "2024-03-20",
      time: "10:00 AM",
      duration: "2 hours",
      status: "Upcoming",
    },
    {
      id: "2",
      parkingName: "City Center Garage",
      date: "2024-03-15",
      time: "2:00 PM",
      duration: "3 hours",
      status: "Completed",
    },
  ],
};

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Avatar.Text
            size={80}
            label={mockUser.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          />
        </View>
        <Card.Content>
          <Title style={styles.name}>{mockUser.name}</Title>
          <Paragraph style={styles.email}>{mockUser.email}</Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.infoCard}>
        <Card.Content>
          <Title>Personal Information</Title>
          <List.Item
            title="Phone"
            description={mockUser.phone}
            left={(props) => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Vehicle Number"
            description={mockUser.vehicle}
            left={(props) => <List.Icon {...props} icon="car" />}
          />
        </Card.Content>
      </Card>

      <Card style={styles.bookingsCard}>
        <Card.Content>
          <Title>Recent Bookings</Title>
          {mockUser.bookings.map((booking) => (
            <Card key={booking.id} style={styles.bookingItem}>
              <Card.Content>
                <Title style={styles.parkingName}>{booking.parkingName}</Title>
                <Paragraph>Date: {booking.date}</Paragraph>
                <Paragraph>Time: {booking.time}</Paragraph>
                <Paragraph>Duration: {booking.duration}</Paragraph>
                <View style={styles.statusContainer}>
                  <Paragraph
                    style={[
                      styles.status,
                      {
                        color:
                          booking.status === "Upcoming" ? "#2196F3" : "#4CAF50",
                      },
                    ]}
                  >
                    {booking.status}
                  </Paragraph>
                </View>
              </Card.Content>
            </Card>
          ))}
        </Card.Content>
      </Card>

      <Button
        mode="outlined"
        style={styles.logoutButton}
        onPress={() => {
          // Handle logout
          console.log("Logout pressed");
        }}
      >
        Log Out
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  profileCard: {
    margin: 16,
    alignItems: "center",
  },
  avatarContainer: {
    marginTop: 16,
  },
  name: {
    textAlign: "center",
    marginTop: 8,
  },
  email: {
    textAlign: "center",
    marginBottom: 16,
  },
  infoCard: {
    margin: 16,
    marginTop: 0,
  },
  bookingsCard: {
    margin: 16,
    marginTop: 0,
  },
  bookingItem: {
    marginVertical: 8,
  },
  parkingName: {
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  status: {
    fontWeight: "bold",
  },
  logoutButton: {
    margin: 16,
  },
});
