import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../context/ThemeContext';

const EditIssueScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { colors } = useTheme();
  const { issue } = route.params;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    priority: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const categories = [
    'Facility',
    'Technology',
    'Security',
    'Maintenance',
    'Cleaning',
    'Other'
  ];

  const priorities = [
    'Low',
    'Medium',
    'High',
    'Critical'
  ];

  useEffect(() => {
    // Initialize form with current issue data
    setFormData({
      title: issue.title || '',
      description: issue.description || '',
      location: issue.location || '',
      category: issue.category || '',
      priority: issue.priority || '',
    });
  }, [issue]);

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Title is required');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Description is required');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Location is required');
      return false;
    }
    if (!formData.category) {
      Alert.alert('Error', 'Category is required');
      return false;
    }
    if (!formData.priority) {
      Alert.alert('Error', 'Priority is required');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      Alert.alert(
        'Success',
        'Issue updated successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // In a real app, you would update the issue in the backend
              // and then navigate back with the updated data
              navigation.navigate('IssueDetail', { 
                issue: { ...issue, ...formData } 
              });
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update issue. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => navigation.goBack() },
        ]
      );
    } else {
      navigation.goBack();
    }
  };

  const renderInputField = (label, value, onChangeText, placeholder, multiline = false, numberOfLines = 1) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.textInput,
          { 
            color: colors.text, 
            borderColor: colors.border,
            backgroundColor: colors.surfaceVariant 
          },
          multiline && { height: numberOfLines * 20 + 20 }
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  const renderPickerField = (label, value, options, onValueChange) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>{label}</Text>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.pickerOption,
              { 
                backgroundColor: value === option ? colors.primary : colors.surfaceVariant,
                borderColor: colors.border
              }
            ]}
            onPress={() => onValueChange(option)}
          >
            <Text style={[
              styles.pickerOptionText,
              { color: value === option ? '#fff' : colors.text }
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Issue</Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={isLoading || !hasChanges}
          style={[
            styles.saveButton, 
            { backgroundColor: hasChanges ? colors.primary : colors.surfaceVariant },
            (!hasChanges || isLoading) && { opacity: 0.6 }
          ]}
        >
          <Text style={[
            styles.saveButtonText,
            { color: hasChanges ? '#fff' : colors.textSecondary }
          ]}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Issue Status Notice */}
        <View style={[styles.noticeContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.noticeIcon}>ℹ️</Text>
          <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
            You can edit this issue because it's currently {issue.status.toLowerCase()}. 
            Some fields may be restricted based on the current status.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Issue Information</Text>
          
          {renderInputField(
            'Title',
            formData.title,
            (text) => updateFormData('title', text),
            'Enter issue title',
            false
          )}

          {renderInputField(
            'Description',
            formData.description,
            (text) => updateFormData('description', text),
            'Describe the issue in detail',
            true,
            4
          )}

          {renderInputField(
            'Location',
            formData.location,
            (text) => updateFormData('location', text),
            'Enter the location where the issue occurred',
            false
          )}

          {renderPickerField(
            'Category',
            formData.category,
            categories,
            (value) => updateFormData('category', value)
          )}

          {renderPickerField(
            'Priority',
            formData.priority,
            priorities,
            (value) => updateFormData('priority', value)
          )}
        </View>

        {/* Current Issue Info */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Current Status</Text>
          
          <View style={[styles.statusCard, { backgroundColor: colors.surface }]}>
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Status:</Text>
              <View style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(issue.status) }
              ]}>
                <Text style={styles.statusBadgeText}>{issue.status}</Text>
              </View>
            </View>
            
            <View style={styles.statusRow}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Reported:</Text>
              <Text style={[styles.statusValue, { color: colors.text }]}>{issue.date}</Text>
            </View>
            
            {issue.assignedTo && (
              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>Assigned To:</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>{issue.assignedTo}</Text>
              </View>
            )}
            
            {issue.eta && (
              <View style={styles.statusRow}>
                <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>ETA:</Text>
                <Text style={[styles.statusValue, { color: colors.text }]}>{issue.eta}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Edit Restrictions */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Edit Restrictions</Text>
          
          <View style={[styles.restrictionsCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
              • Title and description can be updated
            </Text>
            <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
              • Location can be updated for better accuracy
            </Text>
            <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
              • Category and priority can be adjusted
            </Text>
            <Text style={[styles.restrictionText, { color: colors.textSecondary }]}>
              • Status and assignment cannot be changed by users
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Resolved':
      return '#4CAF50';
    case 'In Progress':
      return '#2196F3';
    case 'Pending':
      return '#FF9800';
    default:
      return '#666';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  noticeContainer: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    alignItems: 'center',
  },
  noticeIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  noticeText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  pickerOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusCard: {
    padding: 15,
    borderRadius: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusValue: {
    fontSize: 14,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  restrictionsCard: {
    padding: 15,
    borderRadius: 12,
  },
  restrictionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default EditIssueScreen;
