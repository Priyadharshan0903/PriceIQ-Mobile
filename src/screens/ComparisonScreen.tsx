import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ProductCard } from '../components/ProductCard';
import { comparisonService } from '../services/comparison.service';
import { Product, ComparisonResult } from '../types';

export const ComparisonScreen = ({ route, navigation }: any) => {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.addProduct) {
      addProductToComparison(route.params.addProduct);
    }
  }, [route.params?.addProduct]);

  const addProductToComparison = (product: Product) => {
    if (selectedProducts.find((p) => p.id === product.id)) {
      Alert.alert('Already Added', 'This product is already in comparison');
      return;
    }

    if (selectedProducts.length >= 5) {
      Alert.alert('Limit Reached', 'You can compare up to 5 products at once');
      return;
    }

    setSelectedProducts([...selectedProducts, product]);
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
    setComparisonResult(null);
  };

  const compareProducts = async () => {
    if (selectedProducts.length < 2) {
      Alert.alert('Not Enough Products', 'Please select at least 2 products to compare');
      return;
    }

    setLoading(true);
    try {
      const result = await comparisonService.compareProducts(selectedProducts.map((p) => p.id));
      setComparisonResult(result);
    } catch (error) {
      Alert.alert('Error', 'Failed to compare products');
    } finally {
      setLoading(false);
    }
  };

  if (selectedProducts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No Products to Compare</Text>
        <Text style={styles.emptyText}>
          Browse products and tap "Add to Comparison" to start comparing
        </Text>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => navigation.navigate('Products')}
        >
          <Text style={styles.browseButtonText}>Browse Products</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Compare Products</Text>
        <Text style={styles.subtitle}>
          {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'} selected
        </Text>
      </View>

      {/* Selected Products */}
      <View style={styles.selectedSection}>
        {selectedProducts.map((product) => (
          <View key={product.id} style={styles.selectedProduct}>
            <View style={styles.productCardWrapper}>
              <ProductCard
                product={product}
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
              />
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => removeProduct(product.id)}
            >
              <Text style={styles.removeButtonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Compare Button */}
      {selectedProducts.length >= 2 && !comparisonResult && (
        <TouchableOpacity
          style={styles.compareButton}
          onPress={compareProducts}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.compareButtonText}>Compare Now</Text>
          )}
        </TouchableOpacity>
      )}

      {/* Comparison Results */}
      {comparisonResult && (
        <View style={styles.resultsSection}>
          <Text style={styles.resultsTitle}>Comparison Results</Text>

          {/* AI Recommendation */}
          {comparisonResult.recommendation && (
            <View style={styles.recommendationCard}>
              <Text style={styles.recommendationTitle}>🏆 Recommended</Text>
              <Text style={styles.recommendationText}>
                {comparisonResult.recommendation.reason}
              </Text>
            </View>
          )}

          {/* Differences Table */}
          <View style={styles.differencesSection}>
            <Text style={styles.differencesTitle}>Key Differences</Text>
            {comparisonResult.differences.map((diff, index) => (
              <View key={index} style={styles.diffRow}>
                <Text style={styles.diffSpec}>{diff.spec}</Text>
                <View style={styles.diffValues}>
                  {Object.entries(diff.values).map(([productId, value], idx) => {
                    const product = selectedProducts.find((p) => p.id === productId);
                    return (
                      <View key={idx} style={styles.diffValueRow}>
                        <Text style={styles.diffProductName} numberOfLines={1}>
                          {product?.name}
                        </Text>
                        <Text style={styles.diffValue}>{value}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#0046BE',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  selectedSection: {
    padding: 15,
  },
  selectedProduct: {
    marginBottom: 15,
  },
  productCardWrapper: {
    marginBottom: 10,
  },
  removeButton: {
    backgroundColor: '#FF3B30',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  compareButton: {
    backgroundColor: '#0046BE',
    margin: 15,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  compareButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsSection: {
    padding: 15,
  },
  resultsTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  recommendationCard: {
    backgroundColor: '#FFF9E6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  differencesSection: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
  },
  differencesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  diffRow: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  diffSpec: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0046BE',
    marginBottom: 10,
  },
  diffValues: {
    marginLeft: 10,
  },
  diffValueRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  diffProductName: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginRight: 10,
  },
  diffValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
});
