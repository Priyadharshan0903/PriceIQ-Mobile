import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { orderService } from '../services/order.service';
import { Order } from '../types';

export const OrderDetailScreen = ({ route }: any) => {
  const { orderId } = route.params;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const loadOrder = async () => {
    try {
      const data = await orderService.getOrderById(orderId);
      setOrder(data);
    } catch (error) {
      console.error('Failed to load order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !order) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0046BE" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Details</Text>
        <Text style={styles.orderId}>#{order.id.substring(0, 8)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Status</Text>
        <Text style={styles.status}>{order.status.toUpperCase()}</Text>
        <Text style={styles.date}>
          Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({order.items.length})</Text>
        {order.items.map((item, index) => (
          <View key={index} style={styles.item}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>Item #{index + 1}</Text>
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Shipping Address</Text>
        <Text style={styles.addressText}>{order.shippingAddress.street}</Text>
        <Text style={styles.addressText}>
          {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
        </Text>
        <Text style={styles.addressText}>{order.shippingAddress.country}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment</Text>
        <Text style={styles.paymentText}>{order.paymentMethod}</Text>
      </View>

      <View style={styles.totalSection}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>${order.totalAmount.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  orderId: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  status: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0046BE',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: '#666',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0046BE',
  },
  addressText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  paymentText: {
    fontSize: 16,
    color: '#333',
  },
  totalSection: {
    backgroundColor: '#fff',
    marginTop: 15,
    padding: 20,
    marginBottom: 30,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0046BE',
  },
});
