import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api from '../api/client';

const HomeDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    resolved: 0,
    pending: 0,
    inProgress: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
  };

  const formatStatus = (s) => {
    if (!s) return '';
    return String(s).replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Fetch status counts / analytics
      const statusRes = await api.get('/api/v1/analytics/issues/by-status');
      const statusData = statusRes.data || {};

      const total = Object.values(statusData).reduce((s, v) => s + (Number(v) || 0), 0);
      const inProgress = statusData.in_progress || statusData['in_progress'] || statusData.inProgress || 0;
      const resolved = statusData.resolved || statusData['resolved'] || 0;
      const pending = statusData.pending || statusData['pending'] || 0;

      setStats({ total, resolved, pending, inProgress });

      // Fetch recent issues
      const issuesRes = await api.get('/api/v1/issues/all?limit=5');
      const issuesData = issuesRes.data || [];
      const mapped = issuesData.map(i => ({
        id: i.issue_id || i.id,
        title: i.title,
        category: i.category || 'General',
        status: formatStatus(i.status || ''),
        date: i.created_at || i.date,
        priority: i.priority || 'Medium',
        location: i.location || '',
        description: i.description || '',
        assignedTo: i.assigned_to || i.assignedTo || '',
        eta: i.eta || '',
        timeline: i.timeline || [],
        comments: i.comments || []
      }));

      setRecentIssues(mapped);
    } catch (err) {
      console.warn('Error loading dashboard data', err?.message || err);
      setStats({ total: 0, resolved: 0, pending: 0, inProgress: 0 });
      setRecentIssues([]);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical':
        return '#f44336';
      case 'High':
        return '#ff9800';
      case 'Medium':
        return '#2196f3';
      case 'Low':
        return '#4caf50';
      default:
        return '#666';
    }
  };

  const handleReportNewIssue = () => {
    Alert.alert(
      'Report New Issue',
      'This will open the issue reporting form. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => navigation.navigate('ReportIssue') },
      ]
    );
  };

  const handleViewStatus = () => {
    navigation.navigate('Issues');
  };

  const handleViewAllIssues = () => {
    navigation.navigate('AllIssues');
  };

  const handleIssuePress = (issue) => {
    Alert.alert(
      issue.title,
      `Category: ${issue.category}\nStatus: ${issue.status}\nPriority: ${issue.priority}\nDate: ${issue.date}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()},</Text>
          <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Text style={styles.profileText}>👤</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleReportNewIssue}
            >
              <Text style={styles.actionIcon}>📝</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>Report New Issue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleViewStatus}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={[styles.actionText, { color: colors.text }]}>View Status</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Your Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statNumber, { color: colors.text }]}>{stats.total}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Issues</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{stats.resolved}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statNumber, { color: '#FF9800' }]}>{stats.pending}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statNumber, { color: '#2196F3' }]}>{stats.inProgress}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
            </View>
          </View>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Issues</Text>
            <TouchableOpacity onPress={handleViewAllIssues}>
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={[styles.issuesContainer, { backgroundColor: colors.surface }]}>
            {(recentIssues || []).map((issue) => (
              <TouchableOpacity
                key={issue.id}
                style={[styles.issueCard, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => handleIssuePress(issue)}
              >
                <View style={styles.issueHeader}>
                  <Text style={[styles.issueTitle, { color: colors.text }]}>{issue.title}</Text>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(issue.status) }
                  ]}>
                    <Text style={styles.statusText}>{issue.status}</Text>
                  </View>
                </View>
                
                <View style={styles.issueDetails}>
                  <Text style={[styles.issueCategory, { color: colors.textSecondary }]}>{issue.category}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: getPriorityColor(issue.priority) }
                  ]}>
                    <Text style={styles.priorityText}>{issue.priority}</Text>
                  </View>
                </View>
                
                <Text style={[styles.issueDate, { color: colors.textTertiary }]}>{issue.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Tips */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Tips</Text>
          <View style={[styles.tipsContainer, { backgroundColor: colors.surface }]}>
            <View style={[styles.tipCard, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={styles.tipIcon}>💡</Text>
              <Text style={[styles.tipText, { color: colors.text }]}>Include photos for faster resolution</Text>
            </View>
            <View style={[styles.tipCard, { backgroundColor: colors.surfaceVariant }]}>
              <Text style={styles.tipIcon}>📱</Text>
              <Text style={[styles.tipText, { color: colors.text }]}>Track your issues in real-time</Text>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  viewAllText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    padding: 20,
    borderRadius: 15,
    flex: 0.48,
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    padding: 15,
    borderRadius: 12,
    flex: 0.23,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  issuesContainer: {
    borderRadius: 15,
    padding: 15,
  },
  issueCard: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  issueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueCategory: {
    fontSize: 14,
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  issueDate: {
    fontSize: 12,
  },
  tipsContainer: {
    borderRadius: 15,
    padding: 15,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  tipText: {
    fontSize: 14,
    flex: 1,
  },
});

export default HomeDashboardScreen;
