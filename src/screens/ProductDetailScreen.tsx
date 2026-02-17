import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { RatingStars } from '../components/RatingStars';
import { productService } from '../services/product.service';
import { reviewService } from '../services/review.service';
import { cartService } from '../services/cart.service';
import { Product, Review, ReviewStats } from '../types';

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    loadReviews();
    loadStats();
  }, [productId]);

  const loadProduct = async () => {
    try {
      const data = await productService.getProductById(productId);
      setProduct(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load product');
    } finally {
      setLoading(false);
    }
  };

  const loadReviews = async () => {
    try {
      const data = await reviewService.getReviewsByProduct(productId);
      setReviews(data.reviews.slice(0, 3)); // Show first 3 reviews
    } catch (error) {
      console.error('Failed to load reviews:', error);
    }
  };

  const loadStats = async () => {
    try {
      const data = await reviewService.getReviewStats(productId);
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await cartService.addItem(productId, 1);
      Alert.alert('Success', 'Product added to cart!', [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add to cart');
    }
  };

  if (loading || !product) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0046BE" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Product Image */}
      <Image
        source={{ uri: product.images[0] || 'https://via.placeholder.com/300' }}
        style={styles.image}
        resizeMode="contain"
      />

      {/* Product Info */}
      <View style={styles.content}>
        <Text style={styles.brand}>{product.brand}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>

        {/* Rating */}
        {stats && (
          <View style={styles.ratingSection}>
            <RatingStars rating={stats.averageRating} size={20} />
            <Text style={styles.reviewCount}>
              ({stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'})
            </Text>
          </View>
        )}

        {/* Specifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specifications</Text>
          {Object.entries(product.specifications).map(([key, value]) => (
            <View key={key} style={styles.specRow}>
              <Text style={styles.specKey}>{key}</Text>
              <Text style={styles.specValue}>{value}</Text>
            </View>
          ))}
        </View>

        {/* Reviews Preview */}
        {reviews.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Customer Reviews</Text>
            {reviews.map((review) => (
              <View key={review.id} style={styles.reviewCard}>
                <RatingStars rating={review.rating} size={14} showNumber={false} />
                <Text style={styles.reviewTitle}>{review.title}</Text>
                <Text style={styles.reviewContent} numberOfLines={3}>
                  {review.content}
                </Text>
              </View>
            ))}
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All Reviews</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.compareButton}
          onPress={() => navigation.navigate('Compare', { addProduct: product })}
        >
          <Text style={styles.compareText}>Add to Comparison</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  brand: {
    fontSize: 14,
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 5,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  price: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0046BE',
    marginBottom: 15,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  reviewCount: {
    marginLeft: 10,
    color: '#666',
    fontSize: 14,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  specKey: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  specValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  reviewCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
    marginBottom: 5,
  },
  reviewContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  viewAllButton: {
    marginTop: 10,
    padding: 12,
    alignItems: 'center',
  },
  viewAllText: {
    color: '#0046BE',
    fontSize: 14,
    fontWeight: '600',
  },
  addToCartButton: {
    backgroundColor: '#0046BE',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  compareButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#0046BE',
  },
  compareText: {
    color: '#0046BE',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
