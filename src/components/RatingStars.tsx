import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RatingStarsProps {
  rating: number;
  size?: number;
  showNumber?: boolean;
}

export const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = 16, showNumber = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Text key={star} style={[styles.star, { fontSize: size }]}>
          {star <= fullStars ? '⭐' : star === fullStars + 1 && hasHalfStar ? '⭐' : '☆'}
        </Text>
      ))}
      {showNumber && <Text style={styles.number}>{rating.toFixed(1)}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    marginRight: 2,
  },
  number: {
    marginLeft: 6,
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
});
