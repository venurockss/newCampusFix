import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    totalIssues: 0,
    pendingIssues: 0,
    resolvedToday: 0,
    highPriority: 0,
    avgResolutionTime: 0,
    userSatisfaction: 0,
  });
  const [recentIssues, setRecentIssues] = useState([]);

  const userData = user || {
    name: 'Admin',
    email: 'admin@campus.edu',
    role: 'admin',
  };

  const formatStatus = (s) => {
    if (!s) return '';
    return String(s).replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };


  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    (async () => {
      try {
        const res = await api.get('/api/v1/admin/dashboard');
        const data = res.data || {};
        setStats({
          totalIssues: data.total_issues || 0,
          pendingIssues: data.pending_issues || 0,
          resolvedToday: data.resolved_issues || 0,
          highPriority: data.high_priority || 0,
          avgResolutionTime: data.avg_resolution_time || 0,
          userSatisfaction: data.user_satisfaction || 0,
        });

        const issuesRes = await api.get('/api/v1/issues/all?limit=5');
        const issuesData = issuesRes.data || [];
        const mapped = issuesData.map(i => ({
          id: i.issue_id || i.id,
          title: i.title,
          category: i.category || 'General',
          status: formatStatus(i.status || ''),
          priority: i.priority || 'Medium',
          reportedBy: i.reporter_id || i.reporter || '',
          assignedTo: i.assigned_to || i.assignedTo || 'Unassigned',
          date: i.created_at || i.date,
          location: i.location || '',
          description: i.description || '',
          eta: i.eta || '',
          timeline: i.timeline || [],
          comments: i.comments || []
        }));
        setRecentIssues(mapped);
      } catch (err) {
        console.warn('Error loading admin dashboard', err?.message || err);
        setStats({
          totalIssues: 0,
          pendingIssues: 0,
          resolvedToday: 0,
          highPriority: 0,
          avgResolutionTime: 0,
          userSatisfaction: 0,
        });
        setRecentIssues([]);
      }
    })();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadDashboardData();
    setRefreshing(false);
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

  const handleIssuePress = (issue) => {
    Alert.alert(
      issue.title,
      `Status: ${issue.status}\nPriority: ${issue.priority}\nAssigned to: ${issue.assignedTo}\nLocation: ${issue.location}`,
      [
        { text: 'View Details', onPress: () => {
          // Navigate to issue detail
          Alert.alert('Navigation', 'Would navigate to issue detail screen');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'assign':
        navigation.navigate('AssignIssues');
        break;
      case 'resolve':
        navigation.navigate('ResolveIssues');
        break;
      case 'users':
        navigation.navigate('ManageUsers');
        break;
      case 'reports':
        navigation.navigate('GenerateReports');
        break;
      default:
        Alert.alert('Action', `${action} functionality will be implemented.`);
    }
  };

  const renderStatCard = (title, value, subtitle, color = '#4CAF50') => (
    <View style={styles.statCard}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statTitle}>{title}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderIssueCard = ({ item }) => (
    <TouchableOpacity
      style={styles.issueCard}
      onPress={() => handleIssuePress(item)}
    >
      <View style={styles.issueHeader}>
        <Text style={styles.issueTitle}>{item.title}</Text>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) }
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      
      <View style={styles.issueDetails}>
        <Text style={styles.issueCategory}>{item.category}</Text>
        <View style={[
          styles.priorityBadge,
          { backgroundColor: getPriorityColor(item.priority) }
        ]}>
          <Text style={styles.priorityText}>{item.priority}</Text>
        </View>
      </View>
      
      <Text style={styles.issueLocation}>📍 {item.location}</Text>
      <Text style={styles.issueReporter}>👤 {item.reportedBy}</Text>
      <Text style={styles.issueAssigned}>🔧 {item.assignedTo}</Text>
      <Text style={styles.issueDate}>📅 {item.date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.adminName}>{userData.name}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Issues', stats.totalIssues, 'All time', '#4CAF50')}
            {renderStatCard('Pending', stats.pendingIssues, 'Need attention', '#FF9800')}
            {renderStatCard('Resolved Today', stats.resolvedToday, 'Completed', '#2196F3')}
            {renderStatCard('High Priority', stats.highPriority, 'Urgent', '#f44336')}
          </View>
        </View>

        {/* Performance Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Performance Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{stats.avgResolutionTime} days</Text>
              <Text style={styles.metricLabel}>Avg Resolution Time</Text>
            </View>
            <View style={styles.metricCard}>
              <Text style={styles.metricValue}>{stats.userSatisfaction}/5</Text>
              <Text style={styles.metricLabel}>User Satisfaction</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('assign')}
            >
              <Text style={styles.actionIcon}>👥</Text>
              <Text style={styles.actionText}>Assign Issues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('resolve')}
            >
              <Text style={styles.actionIcon}>✅</Text>
              <Text style={styles.actionText}>Resolve Issues</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('users')}
            >
              <Text style={styles.actionIcon}>👤</Text>
              <Text style={styles.actionText}>Manage Users</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => handleQuickAction('reports')}
            >
              <Text style={styles.actionIcon}>📊</Text>
              <Text style={styles.actionText}>Generate Reports</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Issues */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={recentIssues}
            renderItem={renderIssueCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>System Health</Text>
          <View style={styles.healthContainer}>
            <View style={styles.healthItem}>
              <Text style={styles.healthIcon}>🟢</Text>
              <Text style={styles.healthText}>All Systems Operational</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthIcon}>📱</Text>
              <Text style={styles.healthText}>App Performance: Excellent</Text>
            </View>
            <View style={styles.healthItem}>
              <Text style={styles.healthIcon}>🔔</Text>
              <Text style={styles.healthText}>Notifications: Active</Text>
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
  welcomeText: {
    fontSize: 16,
    color: '#888',
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  statSubtitle: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  metricsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricCard: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 4,
  },
  metricLabel: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
    marginBottom: 10,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  issueCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueTitle: {
    color: '#fff',
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
    color: '#888',
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
  issueLocation: {
    color: '#888',
    fontSize: 12,
    marginBottom: 4,
  },
  issueReporter: {
    color: '#4CAF50',
    fontSize: 12,
    marginBottom: 2,
  },
  issueAssigned: {
    color: '#2196F3',
    fontSize: 12,
    marginBottom: 2,
  },
  issueDate: {
    color: '#666',
    fontSize: 12,
  },
  healthContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 15,
  },
  healthItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  healthIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  healthText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default AdminDashboardScreen;
