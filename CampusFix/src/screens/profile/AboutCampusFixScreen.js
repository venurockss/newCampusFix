import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

const AboutCampusFixScreen = ({ navigation }) => {
  const { colors } = useTheme();

  const appInfo = {
    name: 'CampusFix',
    version: '1.0.0',
    buildNumber: '2024.1.0',
    releaseDate: 'December 2024',
    developer: 'CampusFix Team',
    website: 'https://campusfix.com',
    supportEmail: 'support@campusfix.com',
    privacyPolicy: 'https://campusfix.com/privacy',
    termsOfService: 'https://campusfix.com/terms',
  };

  const features = [
    {
      category: 'Issue Management',
      items: [
        'Report new issues with photos and location',
        'Track issue status and progress',
        'Real-time notifications and updates',
        'Priority-based issue handling'
      ]
    },
    {
      category: 'User Experience',
      items: [
        'Role-based access control',
        'Dark/Light theme support',
        'Offline capability',
        'Multi-language support'
      ]
    },
    {
      category: 'Administration',
      items: [
        'Comprehensive admin dashboard',
        'Analytics and reporting',
        'Technician assignment',
        'Performance monitoring'
      ]
    }
  ];

  const teamMembers = [
    {
      name: 'Development Team',
      role: 'Mobile & Backend Development',
      description: 'Building robust and scalable solutions'
    },
    {
      name: 'Design Team',
      role: 'UI/UX Design',
      description: 'Creating intuitive user experiences'
    },
    {
      name: 'Support Team',
      role: 'Customer Support',
      description: 'Providing excellent user assistance'
    }
  ];

  const handleOpenLink = async (url) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', 'Unable to open link');
    }
  };

  const handleContactSupport = () => {
    Linking.openURL(`mailto:${appInfo.supportEmail}?subject=Feedback about CampusFix`);
  };

  const handleRateApp = () => {
    Alert.alert(
      'Rate CampusFix',
      'Thank you for using CampusFix! Please rate us on the app store.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rate Now', onPress: () => Alert.alert('Coming Soon', 'App store rating will be available soon.') }
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      'Share CampusFix',
      'Share CampusFix with your friends and colleagues!',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Share', onPress: () => Alert.alert('Coming Soon', 'Social sharing will be available soon.') }
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>About CampusFix</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* App Header */}
        <View style={[styles.appHeader, { backgroundColor: colors.surface }]}>
          <View style={[styles.appIcon, { backgroundColor: colors.primary }]}>
            <Text style={styles.appIconText}>🏫</Text>
          </View>
          <View style={styles.appInfo}>
            <Text style={[styles.appName, { color: colors.text }]}>{appInfo.name}</Text>
            <Text style={[styles.appVersion, { color: colors.textSecondary }]}>
              Version {appInfo.version} ({appInfo.buildNumber})
            </Text>
            <Text style={[styles.appRelease, { color: colors.textSecondary }]}>
              Released {appInfo.releaseDate}
            </Text>
          </View>
        </View>

        {/* App Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>About</Text>
          <View style={[styles.descriptionCard, { backgroundColor: colors.surface }]}>
            <Text style={[styles.descriptionText, { color: colors.textSecondary }]}>
              CampusFix is a comprehensive campus issue management application designed to streamline 
              the process of reporting, tracking, and resolving maintenance and facility issues on campus. 
              Our mission is to create a more efficient and transparent system for campus maintenance, 
              ensuring that issues are addressed promptly and effectively.
            </Text>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Key Features</Text>
          {features.map((category, index) => (
            <View key={index} style={[styles.featureCategory, { backgroundColor: colors.surface }]}>
              <Text style={[styles.featureCategoryTitle, { color: colors.text }]}>
                {category.category}
              </Text>
              {category.items.map((feature, featureIndex) => (
                <View key={featureIndex} style={styles.featureItem}>
                  <Text style={styles.featureBullet}>•</Text>
                  <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                    {feature}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* Team */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Our Team</Text>
          {teamMembers.map((member, index) => (
            <View key={index} style={[styles.teamCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.teamName, { color: colors.text }]}>{member.name}</Text>
              <Text style={[styles.teamRole, { color: colors.primary }]}>{member.role}</Text>
              <Text style={[styles.teamDescription, { color: colors.textSecondary }]}>
                {member.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleRateApp}
            >
              <Text style={styles.actionButtonText}>⭐ Rate App</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surfaceVariant }]}
              onPress={handleShareApp}
            >
              <Text style={[styles.actionButtonText, { color: colors.text }]}>📤 Share App</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact & Links */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact & Links</Text>
          
          <TouchableOpacity 
            style={[styles.linkItem, { backgroundColor: colors.surface }]}
            onPress={handleContactSupport}
          >
            <Text style={styles.linkIcon}>📧</Text>
            <View style={styles.linkText}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Contact Support</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textSecondary }]}>
                Get help and provide feedback
              </Text>
            </View>
            <Text style={[styles.linkArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { backgroundColor: colors.surface }]}
            onPress={() => handleOpenLink(appInfo.website)}
          >
            <Text style={styles.linkIcon}>🌐</Text>
            <View style={styles.linkText}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Visit Website</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textSecondary }]}>
                Learn more about CampusFix
              </Text>
            </View>
            <Text style={[styles.linkArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { backgroundColor: colors.surface }]}
            onPress={() => handleOpenLink(appInfo.privacyPolicy)}
          >
            <Text style={styles.linkIcon}>🔒</Text>
            <View style={styles.linkText}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Privacy Policy</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textSecondary }]}>
                How we protect your data
              </Text>
            </View>
            <Text style={[styles.linkArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkItem, { backgroundColor: colors.surface }]}
            onPress={() => handleOpenLink(appInfo.termsOfService)}
          >
            <Text style={styles.linkIcon}>📋</Text>
            <View style={styles.linkText}>
              <Text style={[styles.linkTitle, { color: colors.text }]}>Terms of Service</Text>
              <Text style={[styles.linkSubtitle, { color: colors.textSecondary }]}>
                Usage terms and conditions
              </Text>
            </View>
            <Text style={[styles.linkArrow, { color: colors.textSecondary }]}>›</Text>
          </TouchableOpacity>
        </View>

        {/* App Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Statistics</Text>
          <View style={[styles.statsContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>10K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active Users</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>50K+</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Issues Resolved</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.primary }]}>4.8</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>User Rating</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            Made with ❤️ by the CampusFix Team
          </Text>
          <Text style={[styles.footerText, { color: colors.textSecondary }]}>
            © 2024 CampusFix. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  backButton: { fontSize: 16, fontWeight: '600' },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  appIconText: { fontSize: 40 },
  appInfo: { flex: 1 },
  appName: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  appVersion: { fontSize: 14, marginBottom: 2 },
  appRelease: { fontSize: 12 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  descriptionCard: { padding: 20, borderRadius: 12 },
  descriptionText: { fontSize: 14, lineHeight: 22, textAlign: 'center' },
  featureCategory: { padding: 15, borderRadius: 12, marginBottom: 15 },
  featureCategoryTitle: { fontSize: 16, fontWeight: '600', marginBottom: 10 },
  featureItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  featureBullet: { fontSize: 16, marginRight: 10, color: '#4CAF50' },
  featureText: { fontSize: 14, flex: 1, lineHeight: 20 },
  teamCard: { padding: 15, borderRadius: 12, marginBottom: 10, alignItems: 'center' },
  teamName: { fontSize: 16, fontWeight: '600', marginBottom: 5 },
  teamRole: { fontSize: 14, marginBottom: 8 },
  teamDescription: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  quickActions: { flexDirection: 'row', gap: 10 },
  actionButton: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
  actionButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  linkIcon: { fontSize: 24, marginRight: 15 },
  linkText: { flex: 1 },
  linkTitle: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  linkSubtitle: { fontSize: 12 },
  linkArrow: { fontSize: 18 },
  statsContainer: {
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statNumber: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, textAlign: 'center' },
  footer: { alignItems: 'center', marginTop: 20, marginBottom: 30 },
  footerText: { fontSize: 12, textAlign: 'center', marginBottom: 5 },
});

export default AboutCampusFixScreen;
