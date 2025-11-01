import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  FlatList,
  RefreshControl,
  Modal,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

const ResolveIssuesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('in-progress');
  const [issues, setIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [resolutionModal, setResolutionModal] = useState(false);
  const [resolutionData, setResolutionData] = useState({
    status: 'Resolved',
    resolutionNotes: '',
    completionTime: '',
    technicianNotes: '',
  });

  // Mock data for issues
  const mockIssues = [
    {
      id: '1',
      title: 'Server Room Temperature Critical',
      category: 'Technology',
      status: 'In Progress',
      priority: 'Critical',
      reportedBy: 'John Doe',
      assignedTo: 'Mike Wilson',
      date: '2024-01-18 10:30',
      location: 'IT Building - Server Room',
      description: 'Temperature in server room is above normal levels, need immediate attention.',
      estimatedTime: '2-3 hours',
      startTime: '2024-01-18 11:00',
      technicianNotes: 'Investigating HVAC system, found blocked air filter.',
    },
    {
      id: '2',
      title: 'Security Camera Offline',
      category: 'Security',
      status: 'In Progress',
      priority: 'High',
      reportedBy: 'Sarah Smith',
      assignedTo: 'Alex Johnson',
      date: '2024-01-18 09:15',
      location: 'Main Gate - Camera 3',
      description: 'Security camera at main gate entrance is not functioning properly.',
      estimatedTime: '1-2 hours',
      startTime: '2024-01-18 09:45',
      technicianNotes: 'Replaced faulty power supply, testing connection.',
    },
    {
      id: '3',
      title: 'Water Leak in Chemistry Lab',
      category: 'Facility',
      status: 'In Progress',
      priority: 'High',
      reportedBy: 'Dr. Johnson',
      assignedTo: 'Tom Brown',
      date: '2024-01-18 08:45',
      location: 'Science Building - Lab 205',
      description: 'Water leak detected near the sink area, potential safety hazard.',
      estimatedTime: '3-4 hours',
      startTime: '2024-01-18 09:00',
      technicianNotes: 'Fixed pipe connection, checking for additional leaks.',
    },
    {
      id: '4',
      title: 'Broken Window in Library',
      category: 'Facility',
      status: 'Pending Review',
      priority: 'Medium',
      reportedBy: 'Lisa Chen',
      assignedTo: 'Sam Davis',
      date: '2024-01-18 07:30',
      location: 'Library - Reading Room 2',
      description: 'Large crack in the window, needs replacement.',
      estimatedTime: '4-6 hours',
      startTime: '2024-01-18 08:00',
      technicianNotes: 'Window replaced, cleanup completed.',
    },
    {
      id: '5',
      title: 'Network Connectivity Issues',
      category: 'Technology',
      status: 'Resolved',
      priority: 'Medium',
      reportedBy: 'Mark Wilson',
      assignedTo: 'Mike Wilson',
      date: '2024-01-17 14:20',
      location: 'Engineering Building - Lab 101',
      description: 'Intermittent network connectivity in computer lab.',
      estimatedTime: '2-3 hours',
      startTime: '2024-01-17 15:00',
      resolutionTime: '2024-01-17 17:30',
      technicianNotes: 'Replaced faulty network switch, all connections restored.',
      resolutionNotes: 'Network switch was malfunctioning due to power surge. Replaced with new unit and tested all connections.',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIssues(mockIssues);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadData();
    setRefreshing(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Resolved':
        return '#4CAF50';
      case 'In Progress':
        return '#2196F3';
      case 'Pending Review':
        return '#FF9800';
      case 'Pending':
        return '#FF9800';
      default:
        return '#666';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technology':
        return '💻';
      case 'Security':
        return '🔒';
      case 'Facility':
        return '🏢';
      case 'Maintenance':
        return '🔧';
      case 'Cleaning':
        return '🧹';
      default:
        return '📋';
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'in-progress' && issue.status === 'In Progress') ||
                         (selectedFilter === 'pending-review' && issue.status === 'Pending Review') ||
                         (selectedFilter === 'resolved' && issue.status === 'Resolved');
    
    return matchesSearch && matchesFilter;
  });

  const handleResolveIssue = (issue) => {
    setSelectedIssue(issue);
    setResolutionData({
      status: 'Resolved',
      resolutionNotes: '',
      completionTime: new Date().toLocaleTimeString(),
      technicianNotes: issue.technicianNotes || '',
    });
    setResolutionModal(true);
  };

  const handleUpdateStatus = (issue, newStatus) => {
    Alert.alert(
      'Update Status',
      `Change status to "${newStatus}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Update', 
          onPress: async () => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              const updatedIssues = issues.map(i => 
                i.id === issue.id 
                  ? { ...i, status: newStatus }
                  : i
              );
              setIssues(updatedIssues);
              
              Alert.alert('Success', `Status updated to ${newStatus}`);
            } catch (error) {
              Alert.alert('Error', 'Failed to update status. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleSubmitResolution = async () => {
    if (!resolutionData.resolutionNotes.trim()) {
      Alert.alert('Error', 'Resolution notes are required');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedIssues = issues.map(i => 
        i.id === selectedIssue.id 
          ? { 
              ...i, 
              status: resolutionData.status,
              resolutionNotes: resolutionData.resolutionNotes,
              resolutionTime: resolutionData.completionTime,
              technicianNotes: resolutionData.technicianNotes,
            }
          : i
      );
      setIssues(updatedIssues);
      
      setResolutionModal(false);
      setSelectedIssue(null);
      Alert.alert('Success', 'Issue resolved successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to resolve issue. Please try again.');
    }
  };

  const handleIssuePress = (issue) => {
    Alert.alert(
      issue.title,
      `Priority: ${issue.priority}\nCategory: ${issue.category}\nLocation: ${issue.location}\n\nDescription: ${issue.description}\n\nStatus: ${issue.status}\nAssigned to: ${issue.assignedTo}\n\nTechnician Notes: ${issue.technicianNotes || 'None'}`,
      [
        { text: 'View Details', onPress: () => {
          // Navigate to issue detail
          Alert.alert('Navigation', 'Would navigate to issue detail screen');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderIssueCard = ({ item }) => (
    <View style={[styles.issueCard, { backgroundColor: colors.surface }]}>
      <TouchableOpacity onPress={() => handleIssuePress(item)}>
        <View style={styles.issueHeader}>
          <View style={styles.issueTitleContainer}>
            <Text style={[styles.issueTitle, { color: colors.text }]}>{item.title}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(item.status) }
            ]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: getPriorityColor(item.priority) }
          ]}>
            <Text style={styles.priorityText}>{item.priority}</Text>
          </View>
        </View>
        
        <View style={styles.issueDetails}>
          <View style={styles.issueInfo}>
            <Text style={styles.categoryIcon}>{getCategoryIcon(item.category)}</Text>
            <Text style={[styles.issueCategory, { color: colors.textSecondary }]}>{item.category}</Text>
          </View>
          <Text style={[styles.issueLocation, { color: colors.textSecondary }]}>📍 {item.location}</Text>
        </View>
        
        <Text style={[styles.issueDescription, { color: colors.textSecondary }]} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.issueFooter}>
          <Text style={[styles.issueReporter, { color: colors.primary }]}>👤 {item.reportedBy}</Text>
          <Text style={[styles.issueAssigned, { color: colors.textSecondary }]}>🔧 {item.assignedTo}</Text>
        </View>
        
        <View style={styles.issueTimeline}>
          <Text style={[styles.timelineText, { color: colors.textSecondary }]}>
            📅 Reported: {item.date}
          </Text>
          {item.startTime && (
            <Text style={[styles.timelineText, { color: colors.textSecondary }]}>
              🚀 Started: {item.startTime}
            </Text>
          )}
          {item.resolutionTime && (
            <Text style={[styles.timelineText, { color: colors.textSecondary }]}>
              ✅ Resolved: {item.resolutionTime}
            </Text>
          )}
        </View>
      </TouchableOpacity>
      
      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        {item.status === 'In Progress' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleResolveIssue(item)}
            >
              <Text style={styles.actionButtonText}>✅ Resolve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#FF9800' }]}
              onPress={() => handleUpdateStatus(item, 'Pending Review')}
            >
              <Text style={styles.actionButtonText}>📋 Review</Text>
            </TouchableOpacity>
          </>
        )}
        
        {item.status === 'Pending Review' && (
          <>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#4CAF50' }]}
              onPress={() => handleResolveIssue(item)}
            >
              <Text style={styles.actionButtonText}>✅ Approve & Resolve</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: '#2196F3' }]}
              onPress={() => handleUpdateStatus(item, 'In Progress')}
            >
              <Text style={styles.actionButtonText}>🔄 Reopen</Text>
            </TouchableOpacity>
          </>
        )}
        
        {item.status === 'Resolved' && (
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#666' }]}
            onPress={() => handleUpdateStatus(item, 'In Progress')}
          >
            <Text style={styles.actionButtonText}>🔄 Reopen</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  const renderFilterTab = (filter, label, icon) => (
    <TouchableOpacity
      style={[
        styles.filterTab,
        { 
          backgroundColor: selectedFilter === filter ? colors.primary : colors.surface,
          borderColor: colors.border
        }
      ]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={styles.filterIcon}>{icon}</Text>
      <Text style={[
        styles.filterText,
        { color: selectedFilter === filter ? '#fff' : colors.text }
      ]}>
        {label}
      </Text>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Resolve Issues</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { 
              color: colors.text, 
              backgroundColor: colors.surfaceVariant 
            }]}
            placeholder="Search issues by title, description, or location..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {renderFilterTab('all', 'All Issues', '📋')}
          {renderFilterTab('in-progress', 'In Progress', '🔄')}
          {renderFilterTab('pending-review', 'Pending Review', '📋')}
          {renderFilterTab('resolved', 'Resolved', '✅')}
        </ScrollView>

        {/* Issues List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedFilter === 'all' ? 'All Issues' : 
               selectedFilter === 'in-progress' ? 'In Progress Issues' : 
               selectedFilter === 'pending-review' ? 'Pending Review Issues' : 'Resolved Issues'}
            </Text>
            <Text style={[styles.issueCount, { color: colors.textSecondary }]}>
              {filteredIssues.length} issues
            </Text>
          </View>
          
          {filteredIssues.length > 0 ? (
            <FlatList
              data={filteredIssues}
              renderItem={renderIssueCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Issues Found</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'Try adjusting your search terms' : 'No issues match the selected filter'}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Resolution Overview</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>
                {issues.filter(i => i.status === 'In Progress').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>In Progress</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#FF9800' }]}>
                {issues.filter(i => i.status === 'Pending Review').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Pending Review</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {issues.filter(i => i.status === 'Resolved').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Resolution Modal */}
      <Modal
        visible={resolutionModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setResolutionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Resolve Issue</Text>
              <TouchableOpacity onPress={() => setResolutionModal(false)}>
                <Text style={[styles.closeButton, { color: colors.textSecondary }]}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <Text style={[styles.modalSubtitle, { color: colors.text }]}>
                {selectedIssue?.title}
              </Text>
              
              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Status</Text>
                <View style={styles.statusOptions}>
                  {['Resolved', 'Pending Review'].map(status => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.statusOption,
                        { 
                          backgroundColor: resolutionData.status === status ? colors.primary : colors.surfaceVariant,
                          borderColor: colors.border
                        }
                      ]}
                      onPress={() => setResolutionData(prev => ({ ...prev, status }))}
                    >
                      <Text style={[
                        styles.statusOptionText,
                        { color: resolutionData.status === status ? '#fff' : colors.text }
                      ]}>
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Resolution Notes</Text>
                <TextInput
                  style={[styles.textArea, { 
                    color: colors.text, 
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceVariant 
                  }]}
                  value={resolutionData.resolutionNotes}
                  onChangeText={(text) => setResolutionData(prev => ({ ...prev, resolutionNotes: text }))}
                  placeholder="Describe how the issue was resolved..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.modalField}>
                <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Technician Notes</Text>
                <TextInput
                  style={[styles.textArea, { 
                    color: colors.text, 
                    borderColor: colors.border,
                    backgroundColor: colors.surfaceVariant 
                  }]}
                  value={resolutionData.technicianNotes}
                  onChangeText={(text) => setResolutionData(prev => ({ ...prev, technicianNotes: text }))}
                  placeholder="Add any additional technician notes..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </ScrollView>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setResolutionModal(false)}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, { backgroundColor: colors.primary }]}
                onPress={handleSubmitResolution}
              >
                <Text style={styles.modalButtonText}>Submit Resolution</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    marginBottom: 20,
    borderRadius: 12,
    padding: 15,
  },
  searchInput: {
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  filterTabs: {
    marginBottom: 20,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
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
    fontSize: 18,
    fontWeight: 'bold',
  },
  issueCount: {
    fontSize: 14,
  },
  issueCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 15,
    paddingBottom: 10,
  },
  issueTitleContainer: {
    flex: 1,
    marginRight: 10,
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
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
  issueDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  issueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  issueCategory: {
    fontSize: 14,
  },
  issueLocation: {
    fontSize: 12,
  },
  issueDescription: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  issueFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  issueReporter: {
    fontSize: 12,
  },
  issueAssigned: {
    fontSize: 12,
  },
  issueTimeline: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  timelineText: {
    fontSize: 11,
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    borderRadius: 12,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 15,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a3a',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modalBody: {
    padding: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  statusOption: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ResolveIssuesScreen;
