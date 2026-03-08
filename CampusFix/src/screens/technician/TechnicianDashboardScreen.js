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

const TechnicianDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('assigned');
  const [assignedIssues, setAssignedIssues] = useState([]);
  const [reportedIssues, setReportedIssues] = useState([]);
  const [selectedTab, setSelectedTab] = useState('assigned');

  const userData = user || {
    name: 'Mike Wilson',
    email: 'mike.wilson@campus.edu',
    role: 'technician',
  };

  // Assigned issues will be loaded from backend

  useEffect(() => {
    loadAssignedIssues();
    loadReportedIssues();
  }, []);

  const loadAssignedIssues = () => {
    // Fetch assignments for technician from backend
    (async () => {
      try {
        const techId = user?.user_id || user?.id || user?.email || 'unknown';
        const res = await api.get(`/api/v1/technician/assignments/${encodeURIComponent(techId)}`);
        const assignments = res.data || [];

        const humanize = (s) => {
          if (!s) return 'Assigned';
          const map = { in_progress: 'In Progress', resolved: 'Resolved', assigned: 'Assigned', pending: 'Pending' };
          return map[s] || (typeof s === 'string' ? (s.charAt(0).toUpperCase() + s.slice(1)) : 'Assigned');
        };

        const mapped = assignments.map(a => ({
          id: a.assignment_id || a.issue_id || String(Math.random()),
          assignmentId: a.assignment_id,
          issueId: a.issue_id,
          title: a.title || `Issue ${a.issue_id || ''}`,
          category: a.category || 'General',
          status: humanize(a.status),
          rawStatus: a.status,
          priority: a.priority || 'Medium',
          reportedBy: a.reporter || a.reporter_id || '',
          date: a.assigned_at || a.created_at || '',
          location: a.location || '',
          description: a.description || '',
          eta: a.eta || '',
          notes: a.resolution_notes || ''
        }));

        setAssignedIssues(mapped);
      } catch (err) {
        console.warn('Error loading assignments', err?.message || err);
        setAssignedIssues([]);
      }
    })();
  };

  const loadReportedIssues = () => {
    (async () => {
      try {
        const techId = user?.user_id || user?.id || user?.email || 'unknown';
        const res = await api.get(`/api/v1/issues/user/${encodeURIComponent(techId)}`);
        const issues = res.data || [];
        const mapped = issues.map(i => ({
          id: i.issue_id || i.id || String(Math.random()),
          title: i.title,
          category: i.category || 'General',
          status: i.status || 'unknown',
          priority: i.priority || 'Medium',
          date: i.created_at || i.date || '',
          location: i.location || '',
          description: i.description || '',
          assignedTo: i.assigned_to || null,
        }));
        setReportedIssues(mapped);
      } catch (err) {
        console.warn('Error loading reported issues', err?.message || err);
        setReportedIssues([]);
      }
    })();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadAssignedIssues();
    setRefreshing(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return '#4CAF50';
      case 'In Progress':
        return '#2196F3';
      case 'Assigned':
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
    if (selectedFilter === 'all') return assignedIssues;
    return assignedIssues.filter(issue => issue.status.toLowerCase() === selectedFilter.toLowerCase());
  };

  const handleIssuePress = (issue) => {
    Alert.alert(
      issue.title,
      `Status: ${issue.status}\nPriority: ${issue.priority}\nLocation: ${issue.location}\nDescription: ${issue.description}`,
      [
        { text: 'View Details', onPress: () => {
          // Navigate to issue detail
          Alert.alert('Navigation', 'Would navigate to issue detail screen');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleStartWork = (issue) => {
    Alert.alert(
      'Start Work',
      `Are you sure you want to start working on "${issue.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Start', onPress: async () => {
          try {
            const assignmentId = issue.assignmentId;
            if (!assignmentId) throw new Error('Missing assignment id');
            await api.put(`/api/v1/technician/assignment/${assignmentId}/update-status`, null, { params: { new_status: 'in_progress' } });
            // update local state
            setAssignedIssues(prev => prev.map(a => a.assignmentId === assignmentId ? { ...a, status: 'In Progress', rawStatus: 'in_progress' } : a));
            Alert.alert('Success', 'Work started! Issue status updated to In Progress.');
          } catch (err) {
            console.warn('Start work failed', err?.message || err);
            Alert.alert('Error', 'Failed to start work. Please try again.');
          }
        }},
      ]
    );
  };

  const handleMarkResolved = (issue) => {
    Alert.alert(
      'Mark as Resolved',
      `Are you sure you want to mark "${issue.title}" as resolved?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Resolve', onPress: async () => {
          try {
            const assignmentId = issue.assignmentId;
            if (!assignmentId) throw new Error('Missing assignment id');
            await api.put(`/api/v1/technician/assignment/${assignmentId}/update-status`, null, { params: { new_status: 'resolved' } });
            // optionally add a short resolution note
            await api.post(`/api/v1/technician/assignment/${assignmentId}/add-notes`, null, { params: { notes: 'Marked resolved via app' } });
            setAssignedIssues(prev => prev.map(a => a.assignmentId === assignmentId ? { ...a, status: 'Resolved', rawStatus: 'resolved' } : a));
            Alert.alert('Success', 'Issue marked as resolved.');
          } catch (err) {
            console.warn('Mark resolved failed', err?.message || err);
            Alert.alert('Error', 'Failed to mark resolved. Please try again.');
          }
        }},
      ]
    );
  };

  const handleUploadProof = (issue) => {
    Alert.alert(
      'Upload Resolution Proof',
      'Upload photo or notes as proof of resolution',
      [
        { text: 'Take Photo', onPress: () => {
          Alert.alert('Camera', 'Camera functionality will be implemented.');
        }},
        { text: 'Add Notes', onPress: () => {
          Alert.alert('Notes', 'Add resolution notes functionality will be implemented.');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderIssueCard = ({ item }) => (
    <View style={styles.issueCard}>
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
      <Text style={styles.issueReporter}>👤 Reported by: {item.reportedBy}</Text>
      <Text style={styles.issueDate}>📅 {item.date}</Text>
      <Text style={styles.issueDescription}>{item.description}</Text>
      
      {item.eta && (
        <Text style={styles.eta}>⏰ ETA: {item.eta}</Text>
      )}
      
      {item.notes && (
        <Text style={styles.notes}>📝 Notes: {item.notes}</Text>
      )}
      
      {item.resolutionProof && (
        <Text style={styles.resolutionProof}>✅ Resolution: {item.resolutionProof}</Text>
      )}
      
      <View style={styles.actionButtons}>
        {item.status === 'Assigned' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleStartWork(item)}
          >
            <Text style={styles.actionButtonText}>Start Work</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'In Progress' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleMarkResolved(item)}
          >
            <Text style={styles.actionButtonText}>Mark Resolved</Text>
          </TouchableOpacity>
        )}
        
        {item.status === 'Resolved' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleUploadProof(item)}
          >
            <Text style={styles.actionButtonText}>Upload Proof</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={[styles.actionButton, styles.secondaryButton]}
          onPress={() => handleIssuePress(item)}
        >
          <Text style={styles.secondaryButtonText}>View Details</Text>
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
      onPress={() => setSelectedFilter(filter)}
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
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.technicianName}>{userData.name}</Text>
        </View>
        <TouchableOpacity style={styles.settingsButton}>
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabSelector}>
        <TouchableOpacity style={[styles.tabButton, selectedTab === 'assigned' && styles.tabButtonActive]} onPress={() => setSelectedTab('assigned')}>
          <Text style={[styles.tabText, selectedTab === 'assigned' && styles.tabTextActive]}>Assigned</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tabButton, selectedTab === 'reported' && styles.tabButtonActive]} onPress={() => setSelectedTab('reported')}>
          <Text style={[styles.tabText, selectedTab === 'reported' && styles.tabTextActive]}>Reported</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{assignedIssues.length}</Text>
          <Text style={styles.statLabel}>Assigned Issues</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {assignedIssues.filter(issue => issue.status === 'In Progress').length}
          </Text>
          <Text style={styles.statLabel}>In Progress</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {assignedIssues.filter(issue => issue.status === 'Resolved').length}
          </Text>
          <Text style={styles.statLabel}>Resolved</Text>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('assigned', 'Assigned')}
          {renderFilterButton('resolved', 'Resolved')}
      </View>

      {/* Issues List */}
      <FlatList
        data={selectedTab === 'assigned' ? getFilteredIssues() : reportedIssues}
        renderItem={renderIssueCard}
        keyExtractor={(item) => item.id}
        style={styles.issuesList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔧</Text>
            <Text style={styles.emptyText}>No issues assigned</Text>
            <Text style={styles.emptySubtext}>
              You don't have any issues assigned to you at the moment.
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
  welcomeText: {
    fontSize: 16,
    color: '#888',
  },
  technicianName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingsIcon: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
  },
  statCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  statLabel: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: 20,
    paddingBottom: 10,
  },
  tabSelector: {
    flexDirection: 'row',
    padding: 12,
    justifyContent: 'center',
    backgroundColor: '#2a2a2a',
  },
  tabButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 6,
    backgroundColor: '#3a3a3a',
  },
  tabButtonActive: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    color: '#fff',
    fontSize: 14,
  },
  tabTextActive: {
    fontWeight: '700',
  },
  filterButton: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  selectedFilterButton: {
    backgroundColor: '#2196F3',
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
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
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
    marginBottom: 4,
  },
  issueDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 8,
  },
  issueDescription: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  eta: {
    color: '#FF9800',
    fontSize: 12,
    marginBottom: 4,
  },
  notes: {
    color: '#2196F3',
    fontSize: 12,
    marginBottom: 4,
  },
  resolutionProof: {
    color: '#4CAF50',
    fontSize: 12,
    marginBottom: 12,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    flex: 1,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#2196F3',
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

export default TechnicianDashboardScreen;
