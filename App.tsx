import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RootStackParamList } from "./src/navigation/types";
import { HomeScreen } from "./src/screens/HomeScreen";
import { ParkingDetailsScreen } from "./src/screens/ParkingDetailsScreen";
import { MapScreen } from "./src/screens/MapScreen";
import { FilterScreen } from "./src/screens/FilterScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: true,
          headerStyle: {
            backgroundColor: "#2563EB",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: "Smart Parking",
          }}
        />
        <Stack.Screen
          name="ParkingDetails"
          component={ParkingDetailsScreen}
          options={{
            title: "Parking Details",
          }}
        />
        <Stack.Screen
          name="Map"
          component={MapScreen}
          options={{
            title: "Map View",
          }}
        />
        <Stack.Screen
          name="Filter"
          component={FilterScreen}
          options={{
            title: "Filters",
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: "My Profile",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
