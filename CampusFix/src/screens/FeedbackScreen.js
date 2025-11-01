import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

const FeedbackScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { issue } = route.params || {};
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
  };

  const handleStarPress = (starIndex) => {
    setRating(starIndex + 1);
  };

  const getRatingText = () => {
    switch (rating) {
      case 1:
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'Rate your experience';
    }
  };

  const getRatingColor = () => {
    switch (rating) {
      case 1:
        return '#f44336';
      case 2:
        return '#ff9800';
      case 3:
        return '#ffc107';
      case 4:
        return '#4caf50';
      case 5:
        return '#4caf50';
      default:
        return '#888';
    }
  };

  const validateForm = () => {
    if (rating === 0) {
      Alert.alert('Error', 'Please provide a rating');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Success',
        'Thank you for your feedback! Your response helps us improve our services.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStar = (index) => (
    <TouchableOpacity
      key={index}
      style={styles.starButton}
      onPress={() => handleStarPress(index)}
    >
      <Text style={[
        styles.starIcon,
        index < rating && { color: '#ffc107' }
      ]}>
        ★
      </Text>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Give Feedback</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Issue Info */}
        {issue && (
          <View style={styles.issueCard}>
            <Text style={styles.issueTitle}>{issue.title}</Text>
            <Text style={styles.issueDetails}>
              {issue.category} • {issue.location}
            </Text>
            <Text style={styles.issueStatus}>✅ Resolved</Text>
          </View>
        )}

        {/* Rating Section */}
        <View style={styles.ratingSection}>
          <Text style={styles.sectionTitle}>Rate Your Experience</Text>
          <Text style={styles.sectionSubtitle}>
            How satisfied are you with the resolution of this issue?
          </Text>
          
          <View style={styles.starsContainer}>
            {[0, 1, 2, 3, 4].map(renderStar)}
          </View>
          
          <Text style={[
            styles.ratingText,
            { color: getRatingColor() }
          ]}>
            {getRatingText()}
          </Text>
        </View>

        {/* Comment Section */}
        <View style={styles.commentSection}>
          <Text style={styles.sectionTitle}>Additional Comments</Text>
          <Text style={styles.sectionSubtitle}>
            Share your thoughts about the service quality (optional)
          </Text>
          
          <TextInput
            style={styles.commentInput}
            placeholder="Tell us about your experience..."
            placeholderTextColor="#666"
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          
          <Text style={styles.charCount}>
            {comment.length}/500 characters
          </Text>
        </View>

        {/* Quick Feedback */}
        <View style={styles.quickFeedbackSection}>
          <Text style={styles.sectionTitle}>Quick Feedback</Text>
          <Text style={styles.sectionSubtitle}>
            Select all that apply
          </Text>
          
          <View style={styles.quickFeedbackContainer}>
            {[
              'Response was timely',
              'Issue was resolved completely',
              'Staff was professional',
              'Communication was clear',
              'Would recommend to others'
            ].map((feedback, index) => (
              <TouchableOpacity
                key={index}
                style={styles.feedbackChip}
                onPress={() => {
                  // Toggle feedback selection
                  Alert.alert('Feedback', `Selected: ${feedback}`);
                }}
              >
                <Text style={styles.feedbackChipText}>{feedback}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </Text>
        </TouchableOpacity>

        {/* Privacy Note */}
        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            Your feedback helps us improve our services. All responses are anonymous and confidential.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#2a2a2a',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  issueCard: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  issueTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  issueDetails: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  issueStatus: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  ratingSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  starButton: {
    padding: 8,
  },
  starIcon: {
    fontSize: 32,
    color: '#666',
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
  },
  commentSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  commentInput: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    color: '#666',
    fontSize: 12,
    textAlign: 'right',
  },
  quickFeedbackSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 25,
  },
  quickFeedbackContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  feedbackChip: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  feedbackChipText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  privacyNote: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  privacyText: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default FeedbackScreen;
