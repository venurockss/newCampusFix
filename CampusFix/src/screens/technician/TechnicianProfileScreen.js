import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const TechnicianProfileScreen = ({ navigation }) => {
  const { user, updateUser, logout } = useAuth();
  const [profile, setProfile] = useState(user || {});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = user?.user_id || user?.id;
      if (!userId) return;
      const res = await api.get(`/api/v1/auth/me/${encodeURIComponent(userId)}`);
      const data = res.data || res;
      setProfile(data);
    } catch (err) {
      console.warn('Failed to load profile', err?.message || err);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const userId = user?.user_id || user?.id;
      const payload = {
        full_name: profile.full_name || profile.name,
        avatar_url: profile.avatar_url || null,
        phone: profile.phone || null,
        department: profile.department || null,
        student_id: profile.student_id || null,
        year: profile.year || null,
        specialization: profile.specialization || null,
      };
      const res = await api.put(`/api/v1/auth/update-profile/${encodeURIComponent(userId)}`, payload);
      const updated = res.data || res;
      updateUser(updated);
      Alert.alert('Success', 'Profile updated');
    } catch (err) {
      console.warn('Update profile failed', err?.message || err);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Technician Profile</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={profile.full_name || profile.name || ''} onChangeText={(v) => setProfile(p => ({ ...p, full_name: v }))} />
        <Text style={styles.label}>Email</Text>
        <TextInput style={[styles.input, { backgroundColor: '#ddd' }]} value={profile.email || ''} editable={false} />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={profile.phone || ''} onChangeText={(v) => setProfile(p => ({ ...p, phone: v }))} />
        <Text style={styles.label}>Specialization</Text>
        <TextInput style={styles.input} value={profile.specialization || ''} onChangeText={(v) => setProfile(p => ({ ...p, specialization: v }))} />
        <TouchableOpacity style={[styles.saveButton, isSaving && styles.disabled]} onPress={handleSave} disabled={isSaving}>
          <Text style={styles.saveText}>{isSaving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => { logout(); navigation.replace('LoginScreen'); }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  content: { padding: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  label: { color: '#888', marginTop: 10, marginBottom: 6 },
  input: { backgroundColor: '#2a2a2a', color: '#fff', padding: 12, borderRadius: 8 },
  saveButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, marginTop: 20, alignItems: 'center' },
  saveText: { color: '#fff', fontWeight: '600' },
  disabled: { opacity: 0.6 },
  logoutButton: { marginTop: 12, alignItems: 'center' },
  logoutText: { color: '#FF5252' },
});

export default TechnicianProfileScreen;
