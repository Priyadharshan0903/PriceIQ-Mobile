import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { orderService } from '../services/order.service';
import { Address } from '../types';

export const CheckoutScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState<Address>({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
  });
  const [paymentMethod, setPaymentMethod] = useState('Credit Card');

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.street || !address.city || !address.state || !address.zipCode) {
      Alert.alert('Incomplete Address', 'Please fill in all address fields');
      return;
    }

    setLoading(true);
    try {
      const order = await orderService.createOrder(address, paymentMethod);

      Alert.alert(
        'Order Placed!',
        `Your order #${order.id.substring(0, 8)} has been placed successfully.`,
        [
          {
            text: 'View Orders',
            onPress: () => navigation.navigate('Profile', { screen: 'OrderHistory' }),
          },
          {
            text: 'Continue Shopping',
            onPress: () => navigation.navigate('Products'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Order Failed', error.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Checkout</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>

        <TextInput
          style={styles.input}
          placeholder="Street Address"
          value={address.street}
          onChangeText={(text) => setAddress({ ...address, street: text })}
          editable={!loading}
        />

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="City"
            value={address.city}
            onChangeText={(text) => setAddress({ ...address, city: text })}
            editable={!loading}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="State"
            value={address.state}
            onChangeText={(text) => setAddress({ ...address, state: text })}
            editable={!loading}
          />
        </View>

        <View style={styles.row}>
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="ZIP Code"
            value={address.zipCode}
            onChangeText={(text) => setAddress({ ...address, zipCode: text })}
            keyboardType="numeric"
            editable={!loading}
          />
          <TextInput
            style={[styles.input, styles.halfInput]}
            placeholder="Country"
            value={address.country}
            onChangeText={(text) => setAddress({ ...address, country: text })}
            editable={!loading}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>

        {['Credit Card', 'Debit Card', 'PayPal', 'Apple Pay'].map((method) => (
          <TouchableOpacity
            key={method}
            style={[
              styles.paymentOption,
              paymentMethod === method && styles.paymentOptionActive,
            ]}
            onPress={() => setPaymentMethod(method)}
            disabled={loading}
          >
            <View style={styles.radio}>
              {paymentMethod === method && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.paymentText}>{method}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.placeOrderButton, loading && styles.buttonDisabled]}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.placeOrderText}>Place Order</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0046BE',
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
  },
  paymentOptionActive: {
    borderColor: '#0046BE',
    backgroundColor: '#F0F7FF',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0046BE',
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0046BE',
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  placeOrderButton: {
    backgroundColor: '#0046BE',
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  placeOrderText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  bottomPadding: {
    height: 30,
  },
});
