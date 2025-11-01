import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Linking,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

const HelpSupportScreen = ({ navigation }) => {
  const { colors } = useTheme();
  
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contactForm, setContactForm] = useState({
    subject: '',
    message: '',
    priority: 'medium',
  });

  const faqCategories = [
    {
      id: 'general',
      title: 'General Questions',
      icon: '❓',
      faqs: [
        {
          question: 'How do I report an issue?',
          answer: 'Go to Home tab and tap "Report New Issue". Fill the form and submit.'
        },
        {
          question: 'How long does resolution take?',
          answer: 'Simple issues: 24-48 hours, Complex issues: 3-5 business days.'
        }
      ]
    },
    {
      id: 'technical',
      title: 'Technical Issues',
      icon: '🔧',
      faqs: [
        {
          question: 'App not loading properly',
          answer: 'Try closing/reopening the app or restart your device.'
        },
        {
          question: 'Can\'t upload photos',
          answer: 'Check camera and photo library permissions in device settings.'
        }
      ]
    }
  ];

  const supportContacts = [
    {
      name: 'General Support',
      email: 'support@campusfix.com',
      phone: '+1 (555) 123-4567',
      hours: '24/7',
      icon: '📞'
    },
    {
      name: 'Technical Support',
      email: 'tech@campusfix.com',
      phone: '+1 (555) 123-4568',
      hours: 'Mon-Fri 8AM-6PM',
      icon: '🔧'
    }
  ];

  const handleContactSupport = async () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert('Success', 'Message sent! We\'ll respond within 24 hours.');
      setContactForm({ subject: '', message: '', priority: 'medium' });
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleCallSupport = (phone) => {
    Alert.alert('Call Support', `Call ${phone}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Call', onPress: () => Linking.openURL(`tel:${phone}`) },
    ]);
  };

  const handleEmailSupport = (email) => {
    Linking.openURL(`mailto:${email}?subject=Support Request`);
  };

  const filteredFAQs = selectedCategory 
    ? faqCategories.find(cat => cat.id === selectedCategory)?.faqs || []
    : faqCategories.flatMap(cat => cat.faqs);

  const searchFilteredFAQs = filteredFAQs.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help & Support</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { 
              color: colors.text, 
              backgroundColor: colors.surfaceVariant 
            }]}
            placeholder="Search for help topics..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryTabs}>
          <TouchableOpacity
            style={[styles.categoryTab, { 
              backgroundColor: !selectedCategory ? colors.primary : colors.surface,
              borderColor: colors.border
            }]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryTabText, { color: !selectedCategory ? '#fff' : colors.text }]}>All</Text>
          </TouchableOpacity>
          
          {faqCategories.map(category => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryTab, { 
                backgroundColor: selectedCategory === category.id ? colors.primary : colors.surface,
                borderColor: colors.border
              }]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={[styles.categoryTabText, { color: selectedCategory === category.id ? '#fff' : colors.text }]}>{category.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Frequently Asked Questions</Text>
          {searchFilteredFAQs.length > 0 ? (
            searchFilteredFAQs.map((faq, index) => (
              <View key={index} style={[styles.faqItem, { backgroundColor: colors.surface }]}>
                <Text style={[styles.faqQuestion, { color: colors.text }]}>{faq.question}</Text>
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>{faq.answer}</Text>
              </View>
            ))
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={[styles.emptyStateText, { color: colors.textSecondary }]}>
                No questions found. Try adjusting your search or category filter.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Contact Support</Text>
          
          {supportContacts.map(contact => (
            <View key={contact.name} style={[styles.contactCard, { backgroundColor: colors.surface }]}>
              <View style={styles.contactHeader}>
                <Text style={styles.contactIcon}>{contact.icon}</Text>
                <View style={styles.contactInfo}>
                  <Text style={[styles.contactName, { color: colors.text }]}>{contact.name}</Text>
                  <Text style={[styles.contactHours, { color: colors.textSecondary }]}>{contact.hours}</Text>
                </View>
              </View>
              
              <View style={styles.contactActions}>
                <TouchableOpacity 
                  style={[styles.contactButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleCallSupport(contact.phone)}
                >
                  <Text style={styles.contactButtonText}>📞 Call</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[styles.contactButton, { backgroundColor: colors.surfaceVariant }]}
                  onPress={() => handleEmailSupport(contact.email)}
                >
                  <Text style={[styles.contactButtonText, { color: colors.text }]}>📧 Email</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}

          <View style={[styles.contactForm, { backgroundColor: colors.surface }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Send us a Message</Text>
            
            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Subject</Text>
              <TextInput
                style={[styles.formInput, { 
                  color: colors.text, 
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border 
                }]}
                value={contactForm.subject}
                onChangeText={(text) => setContactForm(prev => ({ ...prev, subject: text }))}
                placeholder="Brief description of your issue"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.formField}>
              <Text style={[styles.formLabel, { color: colors.textSecondary }]}>Message</Text>
              <TextInput
                style={[styles.formTextArea, { 
                  color: colors.text, 
                  backgroundColor: colors.surfaceVariant,
                  borderColor: colors.border 
                }]}
                value={contactForm.message}
                onChangeText={(text) => setContactForm(prev => ({ ...prev, message: text }))}
                placeholder="Describe your issue in detail..."
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity 
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleContactSupport}
            >
              <Text style={styles.submitButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
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
  searchContainer: { marginBottom: 20, borderRadius: 12, padding: 15 },
  searchInput: { padding: 12, borderRadius: 8, fontSize: 16 },
  categoryTabs: { marginBottom: 20 },
  categoryTab: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, marginRight: 10, borderWidth: 1 },
  categoryTabText: { fontSize: 14, fontWeight: '500' },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  faqItem: { padding: 15, borderRadius: 12, marginBottom: 10 },
  faqQuestion: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  faqAnswer: { fontSize: 14, lineHeight: 20 },
  emptyState: { padding: 30, borderRadius: 12, alignItems: 'center' },
  emptyStateText: { fontSize: 16, textAlign: 'center' },
  contactCard: { padding: 15, borderRadius: 12, marginBottom: 15 },
  contactHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  contactIcon: { fontSize: 24, marginRight: 15 },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
  contactHours: { fontSize: 12 },
  contactActions: { flexDirection: 'row', gap: 10 },
  contactButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },
  contactButtonText: { fontSize: 14, fontWeight: '500', color: '#fff' },
  contactForm: { padding: 20, borderRadius: 12, marginTop: 15 },
  formTitle: { fontSize: 18, fontWeight: '600', marginBottom: 20 },
  formField: { marginBottom: 20 },
  formLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  formInput: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16 },
  formTextArea: { borderWidth: 1, borderRadius: 8, padding: 12, fontSize: 16, height: 100 },
  submitButton: { padding: 15, borderRadius: 10, alignItems: 'center' },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

export default HelpSupportScreen;
