import React from "react";
import { View, Text } from "react-native";
import { styled } from "nativewind";

const StyledView = styled(View);
const StyledText = styled(Text);

export const FilterScreen = () => {
  return (
    <StyledView className="flex-1 p-4 bg-white">
      <StyledText className="text-xl font-bold">Filters</StyledText>
    </StyledView>
  );
};
