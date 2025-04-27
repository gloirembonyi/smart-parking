import React from "react";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Card, Title, Paragraph, Button, List } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";
import { RootStackParamList } from "../navigation/AppNavigator";
import { styled } from "nativewind/dist/styled";

type ParkingDetailsRouteProp = RouteProp<RootStackParamList, "ParkingDetails">;
type ParkingDetailsNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "ParkingDetails"
>;

const StyledView = styled(View, "flex-1 p-4 bg-white");
const StyledText = styled(Text, "text-xl font-bold");

// Mock data - in a real app, this would come from an API
const mockParkingSpot = {
  id: "1",
  name: "Downtown Parking",
  address: "123 Main St",
  available: 45,
  total: 100,
  latitude: 37.7749,
  longitude: -122.4194,
  price: 5,
  features: [
    "Security Cameras",
    "24/7 Access",
    "Covered Parking",
    "EV Charging",
  ],
  operatingHours: "6:00 AM - 11:00 PM",
  rating: 4.5,
};

export const ParkingDetailsScreen = () => {
  const route = useRoute<ParkingDetailsRouteProp>();
  const navigation = useNavigation<ParkingDetailsNavigationProp>();

  return (
    <StyledView>
      <StyledText>Parking Details</StyledText>
      <ScrollView>
        <Card>
          <Card.Content>
            <Title>{mockParkingSpot.name}</Title>
            <Paragraph>{mockParkingSpot.address}</Paragraph>
            <Paragraph>Rating: {mockParkingSpot.rating} ⭐</Paragraph>
          </Card.Content>
        </Card>

        <MapView
          style={styles.map}
          initialRegion={{
            latitude: mockParkingSpot.latitude,
            longitude: mockParkingSpot.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Marker
            coordinate={{
              latitude: mockParkingSpot.latitude,
              longitude: mockParkingSpot.longitude,
            }}
            title={mockParkingSpot.name}
          />
        </MapView>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>Availability</Title>
            <Paragraph>
              {mockParkingSpot.available} spots available out of{" "}
              {mockParkingSpot.total}
            </Paragraph>
            <Paragraph>Price: ${mockParkingSpot.price}/hour</Paragraph>
            <Paragraph>Hours: {mockParkingSpot.operatingHours}</Paragraph>
          </Card.Content>
        </Card>

        <Card style={styles.infoCard}>
          <Card.Content>
            <Title>Features</Title>
            <List.Section>
              {mockParkingSpot.features.map((feature, index) => (
                <List.Item
                  key={index}
                  title={feature}
                  left={(props) => <List.Icon {...props} icon="check" />}
                />
              ))}
            </List.Section>
          </Card.Content>
        </Card>

        <Button
          mode="contained"
          style={styles.bookButton}
          onPress={() =>
            navigation.navigate("Booking", { parkingId: route.params.id })
          }
        >
          Book a Spot
        </Button>
      </ScrollView>
    </StyledView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    height: 200,
    marginVertical: 16,
  },
  infoCard: {
    marginVertical: 8,
  },
  bookButton: {
    margin: 16,
  },
});
