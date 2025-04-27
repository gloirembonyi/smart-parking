import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from "react-native";
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
import { RootStackParamList } from "../navigation/types";
import ParkingService, {
  ParkingSpot,
  ParkingFilter,
} from "../services/ParkingService";
import NotificationService from "../services/NotificationService";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../theme/colors";
import { ParkingSpotCard } from "../components/ParkingSpotCard";

type HomeScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "Home">;
};

const CATEGORIES = ["All", "Nearby", "Popular", "Available", "Covered"];

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
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
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

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
          onPress={() =>
            navigation.navigate("ParkingDetails", { parkingId: item.id })
          }
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data fetching
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const mockParkingSpots = [
    {
      parkingId: "1",
      name: "Downtown Parking",
      address: "123 Main St, City Center",
      price: 5,
      distance: "0.3 mi",
      available: 12,
      imageUrl: "https://example.com/parking1.jpg",
    },
    {
      parkingId: "2",
      name: "Central Station Garage",
      address: "456 Station Ave",
      price: 8,
      distance: "0.7 mi",
      available: 0,
      imageUrl: "https://example.com/parking2.jpg",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={colors.gray[400]}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search for parking spots..."
            style={styles.searchInput}
            placeholderTextColor={colors.gray[400]}
          />
          <TouchableOpacity onPress={() => navigation.navigate("Filter")}>
            <Ionicons name="options" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
        >
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.selectedCategory,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={mockParkingSpots}
        renderItem={({ item }) => (
          <ParkingSpotCard
            name={item.name}
            address={item.address}
            price={item.price}
            distance={item.distance}
            available={item.available}
            imageUrl={item.imageUrl}
            onPress={() =>
              navigation.navigate("ParkingDetails", {
                parkingId: item.parkingId,
              })
            }
          />
        )}
        keyExtractor={(item) => item.parkingId}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.mapButtonContainer}>
        <Button mode="contained" onPress={() => navigation.navigate("Map")}>
          View Map
        </Button>
      </View>

      {renderFiltersModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text.primary,
    fontSize: 16,
  },
  categoriesContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.gray[100],
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: colors.primary,
  },
  categoryText: {
    color: colors.text.secondary,
    fontSize: 14,
    fontWeight: "500",
  },
  selectedCategoryText: {
    color: colors.white,
  },
  listContent: {
    paddingVertical: 8,
  },
  mapButtonContainer: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
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
  list: {
    flex: 1,
  },
});
