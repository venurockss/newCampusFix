import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const IssueStatusScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [issues, setIssues] = useState([]);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
  };

  const formatStatus = (s) => {
    if (!s) return '';
    return String(s).replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Issues for current user will be loaded from backend

  useEffect(() => {
    loadIssues();
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadIssues();
    }, [])
  );

  const loadIssues = () => {
    (async () => {
      try {
        const userId = user?.user_id || user?.id || user?.email || 'unknown';
        const res = await api.get(`/api/v1/issues/user/${encodeURIComponent(userId)}`);
        const data = res.data || [];
        const mapped = data.map(i => ({
          id: i.issue_id || i.id,
          title: i.title,
          category: i.category || 'General',
          status: formatStatus(i.status || ''),
          priority: i.priority || 'Medium',
          date: i.created_at || i.date,
          location: i.location || '',
          description: i.description || '',
          assignedTo: i.assigned_to || i.assignedTo || '',
          eta: i.eta || '',
          timeline: i.timeline || [],
          comments: i.comments || []
        }));
        setIssues(mapped);
      } catch (err) {
        console.warn('Error loading user issues', err?.message || err);
        setIssues([]);
      }
    })();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadIssues();
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

  const getFilteredIssues = () => {
    if (selectedFilter === 'all') return issues;
    return issues.filter(issue => issue.status.toLowerCase() === selectedFilter.toLowerCase());
  };

  const handleIssuePress = (issue) => {
    navigation.navigate('IssueDetail', { issue });
  };

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
  };

  const renderIssueCard = ({ item }) => (
    <View style={styles.issueCard}>
      <TouchableOpacity
        style={styles.issueContent}
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
        <Text style={styles.issueDate}>📅 {item.date}</Text>
        
        {item.assignedTo && (
          <Text style={styles.assignedTo}>👤 Assigned to: {item.assignedTo}</Text>
        )}
        
        {item.eta && (
          <Text style={styles.eta}>⏰ ETA: {item.eta}</Text>
        )}
      </TouchableOpacity>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {(item.status === 'Pending' || item.status === 'In Progress') && (
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditIssue', { issue: item })}
          >
            <Text style={styles.editButtonText}>✏️ Edit</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity
          style={styles.viewButton}
          onPress={() => handleIssuePress(item)}
        >
          <Text style={styles.viewButtonText}>👁️ View</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFilterButton = (filter, label) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        selectedFilter === filter && styles.selectedFilterButton,
      ]}
      onPress={() => handleFilterPress(filter)}
    >
      <Text
        style={[
          styles.filterText,
          selectedFilter === filter && styles.selectedFilterText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Issues</Text>
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportIssue')}
        >
          <Text style={styles.reportButtonText}>+ Report</Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('pending', 'Pending')}
        {renderFilterButton('resolved', 'Resolved')}
      </View>

      {/* Issues List */}
      <FlatList
        data={getFilteredIssues()}
        renderItem={renderIssueCard}
        keyExtractor={(item) => item.id}
        style={styles.issuesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>No issues found</Text>
            <Text style={styles.emptySubtext}>
              {selectedFilter === 'all' 
                ? 'You haven\'t reported any issues yet'
                : `No ${selectedFilter} issues found`
              }
            </Text>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  reportButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
  },
  filterButton: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  selectedFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  issuesList: {
    flex: 1,
    padding: 20,
  },
  issueCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  issueContent: {
    padding: 15,
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
  issueDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 4,
  },
  assignedTo: {
    color: '#4CAF50',
    fontSize: 12,
    marginBottom: 2,
  },
  eta: {
    color: '#FF9800',
    fontSize: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default IssueStatusScreen;
