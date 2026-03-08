import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const ChangePasswordScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const { user, logout } = useAuth();

  const handleChangePassword = async () => {
    // Validation
    if (!formData.currentPassword.trim()) {
      Alert.alert('Error', 'Current password is required');
      return;
    }

    if (!formData.newPassword.trim()) {
      Alert.alert('Error', 'New password is required');
      return;
    }

    if (formData.newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setIsLoading(true);
    try {
      const userId = user?.user_id || user?.userId || user?.id;
      const payload = {
        old_password: formData.currentPassword,
        new_password: formData.newPassword
      };

      const res = await api.post(`/api/v1/auth/change-password`, payload, { params: { user_id: userId } });

      Alert.alert(
        'Success',
        'Password changed successfully! Please login again with your new password.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // logout to force re-login
              await logout();
              navigation.replace('LoginScreen');
            },
          },
        ]
      );
    } catch (error) {
      console.warn('Change password error', error?.response?.data || error?.message || error);
      Alert.alert('Error', 'Failed to change password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 'none', color: colors.textSecondary };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    if (score <= 2) return { strength: 'Weak', color: '#ff4444' };
    if (score <= 3) return { strength: 'Fair', color: '#ffaa00' };
    if (score <= 4) return { strength: 'Good', color: '#4CAF50' };
    return { strength: 'Strong', color: '#00C851' };
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Change Password</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Security Notice */}
        <View style={[styles.noticeContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.noticeIcon}>🔒</Text>
          <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
            For security reasons, you'll need to enter your current password to change it.
          </Text>
        </View>

        {/* Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Password Information</Text>
          
          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Current Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  color: colors.text, 
                  backgroundColor: colors.surfaceVariant 
                }]}
                value={formData.currentPassword}
                onChangeText={(text) => updateFormData('currentPassword', text)}
                placeholder="Enter your current password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPasswords.current}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => togglePasswordVisibility('current')}
                style={styles.eyeButton}
              >
                <Text style={[styles.eyeIcon, { color: colors.textSecondary }]}>
                  {showPasswords.current ? '👁️' : '🙈'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  color: colors.text, 
                  backgroundColor: colors.surfaceVariant 
                }]}
                value={formData.newPassword}
                onChangeText={(text) => updateFormData('newPassword', text)}
                placeholder="Enter your new password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPasswords.new}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => togglePasswordVisibility('new')}
                style={styles.eyeButton}
              >
                <Text style={[styles.eyeIcon, { color: colors.textSecondary }]}>
                  {showPasswords.new ? '👁️' : '🙈'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Password Strength Indicator */}
            {formData.newPassword && (
              <View style={styles.strengthContainer}>
                <Text style={[styles.strengthText, { color: passwordStrength.color }]}>
                  Strength: {passwordStrength.strength}
                </Text>
                <View style={styles.strengthBar}>
                  <View 
                    style={[
                      styles.strengthBarFill, 
                      { 
                        backgroundColor: passwordStrength.color,
                        width: `${(getPasswordStrength(formData.newPassword).strength === 'Weak' ? 25 : 
                                  getPasswordStrength(formData.newPassword).strength === 'Fair' ? 50 :
                                  getPasswordStrength(formData.newPassword).strength === 'Good' ? 75 : 100)}%`
                      }
                    ]} 
                  />
                </View>
              </View>
            )}
          </View>

          <View style={[styles.inputContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Confirm New Password</Text>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, { 
                  color: colors.text, 
                  backgroundColor: colors.surfaceVariant 
                }]}
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                placeholder="Confirm your new password"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry={!showPasswords.confirm}
                autoCapitalize="none"
              />
              <TouchableOpacity 
                onPress={() => togglePasswordVisibility('confirm')}
                style={styles.eyeButton}
              >
                <Text style={[styles.eyeIcon, { color: colors.textSecondary }]}>
                  {showPasswords.confirm ? '👁️' : '🙈'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Password Match Indicator */}
            {formData.confirmPassword && (
              <View style={styles.matchContainer}>
                <Text style={[
                  styles.matchText, 
                  { color: formData.newPassword === formData.confirmPassword ? '#4CAF50' : '#ff4444' }
                ]}>
                  {formData.newPassword === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Password Requirements */}
        <View style={styles.formSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Password Requirements</Text>
          <View style={[styles.requirementsContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>• Minimum 6 characters long</Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>• Include uppercase and lowercase letters</Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>• Include at least one number</Text>
            <Text style={[styles.requirementText, { color: colors.textSecondary }]}>• Include special characters for better security</Text>
          </View>
        </View>

        {/* Change Password Button */}
        <TouchableOpacity 
          style={[
            styles.changePasswordButton, 
            { backgroundColor: colors.primary },
            isLoading && { opacity: 0.7 }
          ]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          <Text style={styles.changePasswordButtonText}>
            {isLoading ? 'Changing Password...' : 'Change Password'}
          </Text>
        </TouchableOpacity>
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
    padding: 15,
    borderRadius: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    marginRight: 10,
  },
  eyeButton: {
    padding: 8,
  },
  eyeIcon: {
    fontSize: 20,
  },
  strengthContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 5,
  },
  strengthBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e0e0e0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  matchContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  matchText: {
    fontSize: 12,
    fontWeight: '500',
  },
  requirementsContainer: {
    padding: 15,
    borderRadius: 12,
  },
  requirementText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  changePasswordButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  changePasswordButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
