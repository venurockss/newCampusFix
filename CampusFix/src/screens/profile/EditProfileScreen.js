import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { useTheme } from '../../context/ThemeContext';

const EditProfileScreen = ({ navigation }) => {
  const { user, updateUser } = useAuth();
  const { colors } = useTheme();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    studentId: user?.studentId || '',
    department: user?.department || '',
    year: user?.year || '',
  });
  
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const userId = user?.user_id || user?.userId || user?.id;
      const payload = {
        full_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        student_id: formData.studentId,
        department: formData.department,
        year: formData.year
      };

      const res = await api.put(`/api/v1/auth/update-profile/${encodeURIComponent(userId)}`, payload);
      const updated = res.data;

      // Update local auth state if available
      if (updateUser) updateUser(updated);

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.warn('Update profile error', error?.response?.data || error?.message || error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave}
          disabled={isLoading}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.saveButtonText}>
            {isLoading ? 'Saving...' : 'Save'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Profile Picture Section */}
        <View style={[styles.profilePictureSection, { backgroundColor: colors.surface }]}>
          <View style={styles.profilePictureContainer}>
            <View style={[styles.profilePicture, { backgroundColor: colors.primary }]}>
              <Text style={styles.profilePictureText}>
                {formData.name.charAt(0).toUpperCase()}
              </Text>
            </View>
            <TouchableOpacity style={[styles.changePictureButton, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={[styles.changePictureText, { color: colors.text }]}>Change Picture</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          
          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
            <TextInput
              style={[styles.textInput, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.surfaceVariant 
              }]}
              value={formData.name}
              onChangeText={(text) => updateFormData('name', text)}
              placeholder="Enter your full name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
            <TextInput
              style={[styles.textInput, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.surfaceVariant 
              }]}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Phone Number</Text>
            <TextInput
              style={[styles.textInput, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.surfaceVariant 
              }]}
              value={formData.phone}
              onChangeText={(text) => updateFormData('phone', text)}
              placeholder="Enter your phone number"
              placeholderTextColor={colors.textSecondary}
              keyboardType="phone-pad"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Student ID</Text>
            <TextInput
              style={[styles.textInput, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.surfaceVariant 
              }]}
              value={formData.studentId}
              onChangeText={(text) => updateFormData('studentId', text)}
              placeholder="Enter your student ID"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Department</Text>
            <TextInput
              style={[styles.textInput, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.surfaceVariant 
              }]}
              value={formData.department}
              onChangeText={(text) => updateFormData('department', text)}
              placeholder="Enter your department"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Year of Study</Text>
            <TextInput
              style={[styles.textInput, { 
                color: colors.text, 
                borderColor: colors.border,
                backgroundColor: colors.surfaceVariant 
              }]}
              value={formData.year}
              onChangeText={(text) => updateFormData('year', text)}
              placeholder="Enter your year of study"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Additional Settings */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Additional Settings</Text>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Change Profile Picture</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingItem, { backgroundColor: colors.surface }]}>
            <Text style={[styles.settingText, { color: colors.text }]}>Privacy Settings</Text>
            <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
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
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profilePictureSection: {
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    alignItems: 'center',
  },
  profilePictureContainer: {
    alignItems: 'center',
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profilePictureText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
  },
  changePictureButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  changePictureText: {
    fontSize: 14,
    fontWeight: '500',
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
    padding: 15,
    borderRadius: 12,
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  settingText: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingArrow: {
    fontSize: 18,
  },
});

export default EditProfileScreen;
