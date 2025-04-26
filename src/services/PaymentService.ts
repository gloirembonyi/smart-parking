import { initStripe, useStripe } from '@stripe/stripe-react-native';
import NotificationService from './NotificationService';

class PaymentService {
  private static instance: PaymentService;
  private initialized: boolean = false;

  private constructor() {}

  public static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await initStripe({
        publishableKey: 'YOUR_PUBLISHABLE_KEY', // Replace with your Stripe publishable key
        merchantIdentifier: 'YOUR_MERCHANT_IDENTIFIER', // Required for Apple Pay
        urlScheme: 'your-app-scheme', // Required for 3D Secure and connecting to Stripe
      });
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing Stripe:', error);
      throw error;
    }
  }

  async createPaymentIntent(amount: number, currency: string = 'USD'): Promise<string> {
    try {
      // In a real app, this would make an API call to your backend
      // which would create a PaymentIntent using the Stripe API
      const response = await fetch('YOUR_API_ENDPOINT/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
        }),
      });

      const { clientSecret } = await response.json();
      return clientSecret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async processPayment(
    amount: number,
    parkingSpotName: string,
    stripe: any,
    currency: string = 'USD'
  ): Promise<boolean> {
    try {
      const clientSecret = await this.createPaymentIntent(amount, currency);
      const { error, paymentIntent } = await stripe.confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
      });

      if (error) {
        console.error('Payment error:', error);
        return false;
      }

      if (paymentIntent.status === 'Succeeded') {
        // Send payment confirmation notification
        await NotificationService.sendPaymentConfirmation(amount / 100, parkingSpotName);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error processing payment:', error);
      return false;
    }
  }

  async savePaymentMethod(
    cardNumber: string,
    expMonth: number,
    expYear: number,
    cvc: string,
    stripe: any
  ): Promise<boolean> {
    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'Card',
        card: {
          number: cardNumber,
          expMonth,
          expYear,
          cvc,
        },
      });

      if (error) {
        console.error('Error saving payment method:', error);
        return false;
      }

      // In a real app, you would save the payment method ID to your backend
      console.log('Payment method created:', paymentMethod.id);
      return true;
    } catch (error) {
      console.error('Error saving payment method:', error);
      return false;
    }
  }

  async getPaymentMethods(): Promise<any[]> {
    try {
      // In a real app, this would fetch saved payment methods from your backend
      return [];
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      return [];
    }
  }

  async refundPayment(paymentIntentId: string): Promise<boolean> {
    try {
      // In a real app, this would make an API call to your backend
      // which would create a refund using the Stripe API
      const response = await fetch('YOUR_API_ENDPOINT/refund-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
        }),
      });

      const { success } = await response.json();
      return success;
    } catch (error) {
      console.error('Error refunding payment:', error);
      return false;
    }
  }
}

export default PaymentService.getInstance(); 