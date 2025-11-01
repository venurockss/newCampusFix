import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

const PrivacySettingsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public', // public, friends, private
    showLocation: true,
    showEmail: false,
    showPhone: false,
    allowNotifications: true,
    allowDataCollection: false,
    allowAnalytics: true,
    allowMarketing: false,
    autoLocation: false,
    shareIssueHistory: false,
    showOnlineStatus: true,
  });

  const [dataSharing, setDataSharing] = useState({
    shareWithAdmins: true,
    shareWithTechnicians: false,
    shareWithFaculty: false,
    shareWithStudents: false,
  });

  const handlePrivacyChange = (key, value) => {
    setPrivacySettings(prev => ({ ...prev, [key]: value }));
  };

  const handleDataSharingChange = (key, value) => {
    setDataSharing(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert(
        'Success',
        'Privacy settings updated successfully!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy settings. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Account Deleted',
              'Your account has been deleted successfully.',
              [{ text: 'OK' }]
            );
          }
        },
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Your data will be exported and sent to your email address. This may take a few minutes.',
      [{ text: 'OK' }]
    );
  };

  const renderSwitchItem = (icon, title, subtitle, value, onValueChange, disabled = false) => (
    <View style={[styles.settingItem, { 
      backgroundColor: colors.surface,
      opacity: disabled ? 0.6 : 1 
    }]}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surfaceVariant, true: colors.primary }}
        thumbColor={value ? '#fff' : colors.textSecondary}
        disabled={disabled}
      />
    </View>
  );

  const renderRadioItem = (icon, title, subtitle, value, selectedValue, onSelect) => (
    <TouchableOpacity 
      style={[styles.radioItem, { 
        backgroundColor: colors.surface,
        borderColor: value === selectedValue ? colors.primary : colors.border 
      }]}
      onPress={() => onSelect(value)}
    >
      <View style={styles.radioLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View style={styles.settingText}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>{subtitle}</Text>}
        </View>
      </View>
      <View style={[
        styles.radioButton,
        { 
          backgroundColor: value === selectedValue ? colors.primary : 'transparent',
          borderColor: value === selectedValue ? colors.primary : colors.border 
        }
      ]}>
        {value === selectedValue && <View style={styles.radioButtonInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Settings</Text>
        <TouchableOpacity 
          onPress={handleSaveSettings}
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Privacy Notice */}
        <View style={[styles.noticeContainer, { backgroundColor: colors.surfaceVariant }]}>
          <Text style={styles.noticeIcon}>🔒</Text>
          <Text style={[styles.noticeText, { color: colors.textSecondary }]}>
            Control how your information is shared and who can see your profile and activity.
          </Text>
        </View>

        {/* Profile Visibility */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Profile Visibility</Text>
          <View style={styles.settingsContainer}>
            {renderRadioItem(
              '🌍', 
              'Public', 
              'Anyone can see your profile', 
              'public', 
              privacySettings.profileVisibility, 
              (value) => handlePrivacyChange('profileVisibility', value)
            )}
            {renderRadioItem(
              '👥', 
              'Friends Only', 
              'Only your friends can see your profile', 
              'friends', 
              privacySettings.profileVisibility, 
              (value) => handlePrivacyChange('profileVisibility', value)
            )}
            {renderRadioItem(
              '🔒', 
              'Private', 
              'Only you can see your profile', 
              'private', 
              privacySettings.profileVisibility, 
              (value) => handlePrivacyChange('profileVisibility', value)
            )}
          </View>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Personal Information</Text>
          <View style={styles.settingsContainer}>
            {renderSwitchItem(
              '📍', 
              'Show Location', 
              'Allow others to see your general location', 
              privacySettings.showLocation, 
              (value) => handlePrivacyChange('showLocation', value)
            )}
            {renderSwitchItem(
              '📧', 
              'Show Email', 
              'Display your email to other users', 
              privacySettings.showEmail, 
              (value) => handlePrivacyChange('showEmail', value)
            )}
            {renderSwitchItem(
              '📱', 
              'Show Phone', 
              'Display your phone number to other users', 
              privacySettings.showPhone, 
              (value) => handlePrivacyChange('showPhone', value)
            )}
            {renderSwitchItem(
              '🟢', 
              'Show Online Status', 
              'Let others know when you\'re online', 
              privacySettings.showOnlineStatus, 
              (value) => handlePrivacyChange('showOnlineStatus', value)
            )}
          </View>
        </View>

        {/* Data Sharing */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Sharing</Text>
          <View style={styles.settingsContainer}>
            {renderSwitchItem(
              '👨‍💼', 
              'Share with Administrators', 
              'Allow admins to access your data for support', 
              dataSharing.shareWithAdmins, 
              (value) => handleDataSharingChange('shareWithAdmins', value)
            )}
            {renderSwitchItem(
              '🔧', 
              'Share with Technicians', 
              'Allow technicians to see your issue details', 
              dataSharing.shareWithTechnicians, 
              (value) => handleDataSharingChange('shareWithTechnicians', value)
            )}
            {renderSwitchItem(
              '👨‍🏫', 
              'Share with Faculty', 
              'Allow faculty members to see your profile', 
              dataSharing.shareWithFaculty, 
              (value) => handleDataSharingChange('shareWithFaculty', value)
            )}
            {renderSwitchItem(
              '👨‍🎓', 
              'Share with Students', 
              'Allow other students to see your profile', 
              dataSharing.shareWithStudents, 
              (value) => handleDataSharingChange('shareWithStudents', value)
            )}
            {renderSwitchItem(
              '📋', 
              'Share Issue History', 
              'Allow others to see your reported issues', 
              privacySettings.shareIssueHistory, 
              (value) => handlePrivacyChange('shareIssueHistory', value)
            )}
          </View>
        </View>

        {/* App Permissions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Permissions</Text>
          <View style={styles.settingsContainer}>
            {renderSwitchItem(
              '🔔', 
              'Push Notifications', 
              'Receive notifications about your issues', 
              privacySettings.allowNotifications, 
              (value) => handlePrivacyChange('allowNotifications', value)
            )}
            {renderSwitchItem(
              '📍', 
              'Auto Location', 
              'Automatically detect your location', 
              privacySettings.autoLocation, 
              (value) => handlePrivacyChange('autoLocation', value)
            )}
            {renderSwitchItem(
              '📊', 
              'Analytics', 
              'Help improve the app with usage data', 
              privacySettings.allowAnalytics, 
              (value) => handlePrivacyChange('allowAnalytics', value)
            )}
            {renderSwitchItem(
              '📈', 
              'Data Collection', 
              'Allow collection of usage statistics', 
              privacySettings.allowDataCollection, 
              (value) => handlePrivacyChange('allowDataCollection', value)
            )}
            {renderSwitchItem(
              '📢', 
              'Marketing Communications', 
              'Receive promotional messages and updates', 
              privacySettings.allowMarketing, 
              (value) => handlePrivacyChange('allowMarketing', value)
            )}
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Management</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.surface }]}
              onPress={handleExportData}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>📤</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Export My Data</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Download a copy of your data</Text>
                </View>
              </View>
              <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.settingItem, { backgroundColor: colors.surface }]}
              onPress={() => Alert.alert('Coming Soon', 'This feature will be available soon.')}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>🗑️</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: colors.text }]}>Delete Specific Data</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Remove specific information</Text>
                </View>
              </View>
              <Text style={[styles.settingArrow, { color: colors.textSecondary }]}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#ff4444' }]}>Danger Zone</Text>
          <View style={styles.settingsContainer}>
            <TouchableOpacity 
              style={[styles.dangerItem, { backgroundColor: colors.surface }]}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingLeft}>
                <Text style={styles.settingIcon}>⚠️</Text>
                <View style={styles.settingText}>
                  <Text style={[styles.settingTitle, { color: '#ff4444' }]}>Delete Account</Text>
                  <Text style={[styles.settingSubtitle, { color: colors.textSecondary }]}>Permanently remove your account and all data</Text>
                </View>
              </View>
              <Text style={[styles.settingArrow, { color: '#ff4444' }]}>›</Text>
            </TouchableOpacity>
          </View>
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
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingsContainer: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
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
    fontSize: 16,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  settingArrow: {
    fontSize: 18,
  },
  radioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderWidth: 1,
  },
  radioLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  dangerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff4444',
  },
});

export default PrivacySettingsScreen;
