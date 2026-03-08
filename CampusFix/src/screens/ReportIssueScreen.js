import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const ReportIssueScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    priority: 'Medium',
  });
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    'Facility',
    'Technology',
    'Security',
    'Maintenance',
    'Safety',
    'Other',
  ];

  const priorities = [
    { id: 'Low', label: 'Low', color: '#4CAF50' },
    { id: 'Medium', label: 'Medium', color: '#2196F3' },
    { id: 'High', label: 'High', color: '#FF9800' },
    { id: 'Critical', label: 'Critical', color: '#F44336' },
  ];

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const { title, description, location, category } = formData;

    if (!title || !description || !location || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return false;
    }

    if (title.length < 5) {
      Alert.alert('Error', 'Title must be at least 5 characters long');
      return false;
    }

    if (description.length < 10) {
      Alert.alert('Error', 'Description must be at least 10 characters long');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const userId = user?.user_id || user?.id || user?.email || null;
      const payload = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: (formData.category || 'Other').toLowerCase(),
        priority: (formData.priority || 'Medium').toLowerCase(),
        image_urls: []
      };

      // Send POST to backend. Backend expects user_id as query param
      const res = await api.post('/api/v1/issues/report', payload, { params: { user_id: userId } });

      if (res && (res.status === 201 || res.status === 200)) {
        Alert.alert('Success', 'Issue reported successfully! You will receive updates on the status.', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        throw new Error('Unexpected server response');
      }
    } catch (error) {
      console.warn('Report issue error', error?.response?.data || error?.message || error);
      const msg = error?.response?.data?.detail || error?.message || 'Failed to submit issue. Please try again.';
      Alert.alert('Error', msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTakePhoto = () => {
    Alert.alert(
      'Add Photo',
      'Photo functionality will be implemented with camera integration.',
      [{ text: 'OK' }]
    );
  };

  const handleSelectPhoto = () => {
    Alert.alert(
      'Select Photo',
      'Gallery selection will be implemented with image picker.',
      [{ text: 'OK' }]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report New Issue</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.form}>
          {/* Title */}
          <Text style={styles.sectionTitle}>Issue Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Brief description of the issue"
            placeholderTextColor="#666"
            value={formData.title}
            onChangeText={(value) => updateFormData('title', value)}
            maxLength={100}
          />

          {/* Category */}
          <Text style={styles.sectionTitle}>Category *</Text>
          <View style={styles.categoryContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryButton,
                  formData.category === category && styles.selectedCategoryButton,
                ]}
                onPress={() => updateFormData('category', category)}
              >
                <Text
                  style={[
                    styles.categoryText,
                    formData.category === category && styles.selectedCategoryText,
                  ]}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Priority */}
          <Text style={styles.sectionTitle}>Priority *</Text>
          <View style={styles.priorityContainer}>
            {priorities.map((priority) => (
              <TouchableOpacity
                key={priority.id}
                style={[
                  styles.priorityButton,
                  formData.priority === priority.id && styles.selectedPriorityButton,
                  { borderColor: priority.color },
                ]}
                onPress={() => updateFormData('priority', priority.id)}
              >
                <Text
                  style={[
                    styles.priorityText,
                    formData.priority === priority.id && styles.selectedPriorityText,
                  ]}
                >
                  {priority.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Location */}
          <Text style={styles.sectionTitle}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Building, room number, or specific area"
            placeholderTextColor="#666"
            value={formData.location}
            onChangeText={(value) => updateFormData('location', value)}
          />

          {/* Description */}
          <Text style={styles.sectionTitle}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Provide detailed description of the issue..."
            placeholderTextColor="#666"
            value={formData.description}
            onChangeText={(value) => updateFormData('description', value)}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />

          {/* Photo Section */}
          <Text style={styles.sectionTitle}>Add Photos (Optional)</Text>
          <View style={styles.photoContainer}>
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={handleTakePhoto}
            >
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>Take Photo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.photoButton}
              onPress={handleSelectPhoto}
            >
              <Text style={styles.photoIcon}>🖼️</Text>
              <Text style={styles.photoText}>Select from Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            <Text style={styles.submitButtonText}>
              {isLoading ? 'Submitting...' : 'Submit Issue'}
            </Text>
          </TouchableOpacity>
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
  scrollContainer: {
    flexGrow: 1,
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
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryButton: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
    flex: 0.48,
    alignItems: 'center',
  },
  selectedCategoryButton: {
    backgroundColor: '#4CAF50',
  },
  categoryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  priorityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 2,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedPriorityButton: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  priorityText: {
    color: '#fff',
    fontWeight: '500',
    fontSize: 12,
  },
  selectedPriorityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  photoButton: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 10,
    flex: 0.48,
    alignItems: 'center',
  },
  photoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  photoText: {
    color: '#fff',
    fontSize: 12,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ReportIssueScreen;
