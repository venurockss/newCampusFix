import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

const SettingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [autoLocation, setAutoLocation] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change functionality will be implemented.');
  };

  const handlePrivacySettings = () => {
    Alert.alert('Privacy Settings', 'Privacy settings functionality will be implemented.');
  };

  const handleDataExport = () => {
    Alert.alert('Export Data', 'Data export functionality will be implemented.');
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => {
          Alert.alert('Success', 'Cache cleared successfully!');
        }},
      ]
    );
  };

  const handleAboutApp = () => {
    Alert.alert(
      'About CampusFix',
      'CampusFix v1.0.0\n\nA comprehensive campus issue management app for students, faculty, and administrators.\n\nFeatures:\n• Report and track issues\n• Real-time notifications\n• Role-based access\n• Analytics and insights\n\n© 2024 CampusFix Team'
    );
  };

  const handleTermsOfService = () => {
    Alert.alert('Terms of Service', 'Terms of service will be displayed here.');
  };

  const handlePrivacyPolicy = () => {
    Alert.alert('Privacy Policy', 'Privacy policy will be displayed here.');
  };

  const renderSettingItem = (icon, title, subtitle, onPress, rightComponent = null) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent || <Text style={styles.settingArrow}>›</Text>}
    </TouchableOpacity>
  );

  const renderSwitchItem = (icon, title, subtitle, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#3a3a3a', true: '#4CAF50' }}
        thumbColor={value ? '#fff' : '#888'}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Account Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.settingsContainer}>
            {renderSettingItem('👤', 'Edit Profile', 'Update your personal information', () => {})}
            {renderSettingItem('🔒', 'Change Password', 'Update your password', handleChangePassword)}
            {renderSettingItem('🛡️', 'Privacy Settings', 'Manage your privacy preferences', handlePrivacySettings)}
            {renderSettingItem('📤', 'Export Data', 'Download your data', handleDataExport)}
          </View>
        </View>

        {/* Notification Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.settingsContainer}>
            {renderSwitchItem(
              '🔔', 
              'Push Notifications', 
              'Receive notifications on your device', 
              pushNotifications, 
              setPushNotifications
            )}
            {renderSwitchItem(
              '📧', 
              'Email Notifications', 
              'Receive notifications via email', 
              emailNotifications, 
              setEmailNotifications
            )}
            {renderSwitchItem(
              '🔊', 
              'Sound', 
              'Play sound for notifications', 
              soundEnabled, 
              setSoundEnabled
            )}
            {renderSwitchItem(
              '📳', 
              'Vibration', 
              'Vibrate for notifications', 
              vibrationEnabled, 
              setVibrationEnabled
            )}
          </View>
        </View>

        {/* App Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.settingsContainer}>
            {renderSwitchItem(
              '🌙', 
              'Dark Mode', 
              'Use dark theme (always enabled)', 
              darkMode, 
              setDarkMode
            )}
            {renderSwitchItem(
              '📍', 
              'Auto Location', 
              'Automatically detect your location', 
              autoLocation, 
              setAutoLocation
            )}
            {renderSettingItem('🗑️', 'Clear Cache', 'Free up storage space', handleClearCache)}
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.settingsContainer}>
            {renderSettingItem('❓', 'Help & Support', 'Get help and contact support', () => {})}
            {renderSettingItem('📱', 'About CampusFix', 'App version and information', handleAboutApp)}
            {renderSettingItem('📋', 'Terms of Service', 'Read our terms of service', handleTermsOfService)}
            {renderSettingItem('🔒', 'Privacy Policy', 'Read our privacy policy', handlePrivacyPolicy)}
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.infoContainer}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Build</Text>
              <Text style={styles.infoValue}>2024.01.18</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Platform</Text>
              <Text style={styles.infoValue}>React Native</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>User ID</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  settingsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 20,
    marginRight: 15,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    color: '#888',
    fontSize: 12,
    marginTop: 2,
  },
  settingArrow: {
    color: '#888',
    fontSize: 18,
  },
  infoContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    color: '#888',
    fontSize: 14,
  },
  infoValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingsScreen;
