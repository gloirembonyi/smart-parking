import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { StripeProvider } from "@stripe/stripe-react-native";
import AppNavigator from "./src/navigation/AppNavigator";
import NotificationService from "./src/services/NotificationService";
import PaymentService from "./src/services/PaymentService";

export default function App() {
  useEffect(() => {
    setupServices();
  }, []);

  const setupServices = async () => {
    // Initialize notification permissions
    await NotificationService.requestPermissions();

    // Initialize Stripe
    await PaymentService.initialize();
  };

  return (
    <StripeProvider
      publishableKey="YOUR_PUBLISHABLE_KEY" // Replace with your Stripe publishable key
      merchantIdentifier="YOUR_MERCHANT_IDENTIFIER" // Required for Apple Pay
    >
      <PaperProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </PaperProvider>
    </StripeProvider>
  );
}
