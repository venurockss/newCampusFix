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
import { useAuth } from '../context/AuthContext';

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

  // Mock data - replace with actual API calls
  const mockIssues = [
    {
      id: '1',
      title: 'Broken Chair in Library',
      category: 'Facility',
      status: 'Resolved',
      priority: 'Medium',
      date: '2024-01-15',
      location: 'Library - Floor 2',
      description: 'Chair in study area has broken leg',
      assignedTo: 'John Smith',
      eta: '2024-01-20',
      timeline: [
        { date: '2024-01-15', action: 'Issue Reported', status: 'completed' },
        { date: '2024-01-16', action: 'Assigned to Technician', status: 'completed' },
        { date: '2024-01-17', action: 'Work Started', status: 'completed' },
        { date: '2024-01-18', action: 'Issue Resolved', status: 'completed' },
      ],
      comments: [
        { user: 'John Smith', message: 'Starting work on this issue', time: '2024-01-16 09:00' },
        { user: 'John Smith', message: 'Chair has been replaced', time: '2024-01-18 14:30' },
      ],
    },
    {
      id: '2',
      title: 'WiFi Connection Issues',
      category: 'Technology',
      status: 'In Progress',
      priority: 'High',
      date: '2024-01-14',
      location: 'Computer Lab - Room 101',
      description: 'WiFi signal is very weak in the computer lab',
      assignedTo: 'Sarah Johnson',
      eta: '2024-01-22',
      timeline: [
        { date: '2024-01-14', action: 'Issue Reported', status: 'completed' },
        { date: '2024-01-15', action: 'Assigned to Technician', status: 'completed' },
        { date: '2024-01-16', action: 'Work Started', status: 'completed' },
        { date: '2024-01-17', action: 'In Progress', status: 'current' },
      ],
      comments: [
        { user: 'Sarah Johnson', message: 'Investigating the WiFi issue', time: '2024-01-16 10:15' },
        { user: 'Sarah Johnson', message: 'Found the problem - router needs replacement', time: '2024-01-17 11:30' },
      ],
    },
    {
      id: '3',
      title: 'Water Leak in Lab',
      category: 'Facility',
      status: 'Pending',
      priority: 'High',
      date: '2024-01-13',
      location: 'Chemistry Lab - Room 205',
      description: 'Water leaking from ceiling in chemistry lab',
      assignedTo: 'Mike Wilson',
      eta: '2024-01-25',
      timeline: [
        { date: '2024-01-13', action: 'Issue Reported', status: 'completed' },
        { date: '2024-01-14', action: 'Under Review', status: 'completed' },
        { date: '2024-01-15', action: 'Pending Assignment', status: 'current' },
      ],
      comments: [
        { user: 'Admin', message: 'Issue is under review', time: '2024-01-14 08:45' },
      ],
    },
  ];

  useEffect(() => {
    loadIssues();
  }, []);

  const loadIssues = () => {
    // Simulate API call
    setIssues(mockIssues);
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
        {renderFilterButton('in progress', 'In Progress')}
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
