import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import {
  Card,
  Title,
  Paragraph,
  Button,
  Searchbar,
  Chip,
  Portal,
  Modal,
  Text,
} from "react-native-paper";
import { RootStackParamList } from "../navigation/AppNavigator";
import ParkingService, {
  ParkingSpot,
  ParkingFilter,
} from "../services/ParkingService";
import NotificationService from "../services/NotificationService";

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [filters, setFilters] = useState<ParkingFilter>({
    type: "all",
    maxPrice: undefined,
    features: [],
    accessibility: {
      handicapped: false,
      ev_charging: false,
      covered: false,
    },
  });
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    setupLocation();
    loadParkingSpots();
  }, []);

  useEffect(() => {
    loadParkingSpots();
  }, [filters, searchQuery]);

  const setupLocation = async () => {
    const location = await ParkingService.getCurrentLocation();
    if (location) {
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    }
  };

  const loadParkingSpots = async () => {
    const spots = await ParkingService.getNearbyParkingSpots(filters);
    const filteredSpots = spots.filter(
      (spot) =>
        spot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        spot.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setParkingSpots(filteredSpots);
  };

  const getMarkerColor = (available: number, total: number) => {
    const ratio = available / total;
    if (ratio > 0.5) return "green";
    if (ratio > 0.2) return "orange";
    return "red";
  };

  const renderParkingSpot = ({ item }: { item: ParkingSpot }) => (
    <Card style={styles.card}>
      <Card.Content>
        <Title>{item.name}</Title>
        <Paragraph>{item.address}</Paragraph>
        <Paragraph>
          Available: {item.available}/{item.total} spots
        </Paragraph>
        <Paragraph>${item.price}/hour</Paragraph>
        {item.distance && (
          <Paragraph>Distance: {item.distance.toFixed(1)} km</Paragraph>
        )}
        {item.eta && <Paragraph>ETA: {item.eta} min</Paragraph>}
        <View style={styles.features}>
          {item.features.map((feature, index) => (
            <Chip key={index} style={styles.chip}>
              {feature}
            </Chip>
          ))}
        </View>
      </Card.Content>
      <Card.Actions>
        <Button
          mode="contained"
          onPress={() => navigation.navigate("ParkingDetails", { id: item.id })}
        >
          View Details
        </Button>
      </Card.Actions>
    </Card>
  );

  const renderFiltersModal = () => (
    <Portal>
      <Modal
        visible={showFilters}
        onDismiss={() => setShowFilters(false)}
        contentContainerStyle={styles.modal}
      >
        <Title>Filters</Title>

        <Text style={styles.filterTitle}>Parking Type</Text>
        <View style={styles.chipGroup}>
          <Chip
            selected={filters.type === "all"}
            onPress={() => setFilters({ ...filters, type: "all" })}
            style={styles.chip}
          >
            All
          </Chip>
          <Chip
            selected={filters.type === "public"}
            onPress={() => setFilters({ ...filters, type: "public" })}
            style={styles.chip}
          >
            Public
          </Chip>
          <Chip
            selected={filters.type === "private"}
            onPress={() => setFilters({ ...filters, type: "private" })}
            style={styles.chip}
          >
            Private
          </Chip>
        </View>

        <Text style={styles.filterTitle}>Accessibility</Text>
        <View style={styles.chipGroup}>
          <Chip
            selected={filters.accessibility?.handicapped}
            onPress={() =>
              setFilters({
                ...filters,
                accessibility: {
                  ...filters.accessibility,
                  handicapped: !filters.accessibility?.handicapped,
                },
              })
            }
            style={styles.chip}
          >
            Handicapped
          </Chip>
          <Chip
            selected={filters.accessibility?.ev_charging}
            onPress={() =>
              setFilters({
                ...filters,
                accessibility: {
                  ...filters.accessibility,
                  ev_charging: !filters.accessibility?.ev_charging,
                },
              })
            }
            style={styles.chip}
          >
            EV Charging
          </Chip>
          <Chip
            selected={filters.accessibility?.covered}
            onPress={() =>
              setFilters({
                ...filters,
                accessibility: {
                  ...filters.accessibility,
                  covered: !filters.accessibility?.covered,
                },
              })
            }
            style={styles.chip}
          >
            Covered
          </Chip>
        </View>

        <Button
          mode="contained"
          onPress={() => setShowFilters(false)}
          style={styles.applyButton}
        >
          Apply Filters
        </Button>
      </Modal>
    </Portal>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search for parking"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        <Button
          mode="contained"
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}
        >
          Filters
        </Button>
      </View>

      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: userLocation?.latitude ?? 37.7749,
          longitude: userLocation?.longitude ?? -122.4194,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation
        showsMyLocationButton
      >
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.latitude,
              longitude: spot.longitude,
            }}
            title={spot.name}
            description={`${spot.available} spots available`}
            pinColor={getMarkerColor(spot.available, spot.total)}
          />
        ))}
      </MapView>

      <FlatList
        data={parkingSpots}
        renderItem={renderParkingSpot}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />

      {renderFiltersModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  searchbar: {
    flex: 1,
    marginRight: 8,
  },
  filterButton: {
    marginLeft: 8,
  },
  map: {
    height: 300,
  },
  list: {
    flex: 1,
  },
  card: {
    margin: 8,
  },
  features: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  chip: {
    margin: 4,
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  chipGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  applyButton: {
    marginTop: 16,
  },
});
