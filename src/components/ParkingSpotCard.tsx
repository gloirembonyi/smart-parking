import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { tailwind, getColor } from "../utils/tailwind";

interface ParkingSpotCardProps {
  name: string;
  address: string;
  price: number;
  distance: string;
  available: number;
  imageUrl: string;
  onPress: () => void;
}

export const ParkingSpotCard: React.FC<ParkingSpotCardProps> = ({
  name,
  address,
  price,
  distance,
  available,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={tailwind(
        "bg-white rounded-lg mx-4 my-2 shadow-md overflow-hidden"
      )}
      onPress={onPress}
    >
      <Image
        source={{ uri: imageUrl }}
        style={[tailwind("w-full h-40"), { resizeMode: "cover" }]}
      />
      <View style={tailwind("p-4")}>
        <View style={tailwind("flex-row justify-between items-center mb-2")}>
          <Text style={tailwind("text-lg font-semibold text-gray-900 flex-1")}>
            {name}
          </Text>
          <View style={tailwind("flex-row items-baseline")}>
            <Text style={tailwind("text-xl font-bold text-primary")}>
              ${price}
            </Text>
            <Text style={tailwind("text-sm text-gray-600 ml-1")}>/hr</Text>
          </View>
        </View>

        <Text style={tailwind("text-sm text-gray-600 mb-3")}>{address}</Text>

        <View style={tailwind("flex-row items-center justify-between")}>
          <View style={tailwind("flex-row items-center mr-4")}>
            <Ionicons name="location" size={16} color={getColor("primary")} />
            <Text style={tailwind("text-sm text-gray-600 ml-1")}>
              {distance}
            </Text>
          </View>

          <View style={tailwind("flex-row items-center mr-4")}>
            <Ionicons name="car" size={16} color={getColor("primary")} />
            <Text style={tailwind("text-sm text-gray-600 ml-1")}>
              {available} spots
            </Text>
          </View>

          <View
            style={tailwind(
              `px-2 py-1 rounded-full ${
                available > 0 ? "bg-success" : "bg-danger"
              }`
            )}
          >
            <Text style={tailwind("text-xs font-medium text-white")}>
              {available > 0 ? "Available" : "Full"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
