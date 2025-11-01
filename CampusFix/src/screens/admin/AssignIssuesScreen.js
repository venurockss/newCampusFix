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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

const AssignIssuesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [issues, setIssues] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  // Mock data for issues
  const mockIssues = [
    {
      id: '1',
      title: 'Server Room Temperature Critical',
      category: 'Technology',
      status: 'Pending',
      priority: 'Critical',
      reportedBy: 'John Doe',
      assignedTo: null,
      date: '2024-01-18 10:30',
      location: 'IT Building - Server Room',
      description: 'Temperature in server room is above normal levels, need immediate attention.',
      estimatedTime: '2-3 hours',
    },
    {
      id: '2',
      title: 'Security Camera Offline',
      category: 'Security',
      status: 'Pending',
      priority: 'High',
      reportedBy: 'Sarah Smith',
      assignedTo: null,
      date: '2024-01-18 09:15',
      location: 'Main Gate - Camera 3',
      description: 'Security camera at main gate entrance is not functioning properly.',
      estimatedTime: '1-2 hours',
    },
    {
      id: '3',
      title: 'Water Leak in Chemistry Lab',
      category: 'Facility',
      status: 'Pending',
      priority: 'High',
      reportedBy: 'Dr. Johnson',
      assignedTo: null,
      date: '2024-01-18 08:45',
      location: 'Science Building - Lab 205',
      description: 'Water leak detected near the sink area, potential safety hazard.',
      estimatedTime: '3-4 hours',
    },
    {
      id: '4',
      title: 'Broken Window in Library',
      category: 'Facility',
      status: 'Pending',
      priority: 'Medium',
      reportedBy: 'Lisa Chen',
      assignedTo: null,
      date: '2024-01-18 07:30',
      location: 'Library - Reading Room 2',
      description: 'Large crack in the window, needs replacement.',
      estimatedTime: '4-6 hours',
    },
  ];

  // Mock data for technicians
  const mockTechnicians = [
    {
      id: '1',
      name: 'Mike Wilson',
      specialization: 'Technology',
      currentLoad: 3,
      rating: 4.8,
      available: true,
      avatar: '👨‍💻',
    },
    {
      id: '2',
      name: 'Tom Brown',
      specialization: 'Facility',
      currentLoad: 2,
      rating: 4.6,
      available: true,
      avatar: '👷‍♂️',
    },
    {
      id: '3',
      name: 'Alex Johnson',
      specialization: 'Security',
      currentLoad: 1,
      rating: 4.9,
      available: true,
      avatar: '👮‍♂️',
    },
    {
      id: '4',
      name: 'Sam Davis',
      specialization: 'General',
      currentLoad: 4,
      rating: 4.4,
      available: false,
      avatar: '👨‍🔧',
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setIssues(mockIssues);
    setTechnicians(mockTechnicians);
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
                         (selectedFilter === 'unassigned' && !issue.assignedTo) ||
                         (selectedFilter === 'high-priority' && ['High', 'Critical'].includes(issue.priority));
    
    return matchesSearch && matchesFilter;
  });

  const handleAssignIssue = (issue, technician) => {
    Alert.alert(
      'Assign Issue',
      `Assign "${issue.title}" to ${technician.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Assign', 
          onPress: async () => {
            try {
              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              // Update the issue
              const updatedIssues = issues.map(i => 
                i.id === issue.id 
                  ? { ...i, assignedTo: technician.name, status: 'In Progress' }
                  : i
              );
              setIssues(updatedIssues);
              
              // Update technician load
              const updatedTechnicians = technicians.map(t =>
                t.id === technician.id
                  ? { ...t, currentLoad: t.currentLoad + 1 }
                  : t
              );
              setTechnicians(updatedTechnicians);
              
              Alert.alert('Success', `Issue assigned to ${technician.name}`);
            } catch (error) {
              Alert.alert('Error', 'Failed to assign issue. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleIssuePress = (issue) => {
    Alert.alert(
      issue.title,
      `Priority: ${issue.priority}\nCategory: ${issue.category}\nLocation: ${issue.location}\n\nDescription: ${issue.description}\n\nEstimated Time: ${issue.estimatedTime}`,
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
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(item.priority) }
            ]}>
              <Text style={styles.priorityText}>{item.priority}</Text>
            </View>
          </View>
          <Text style={styles.issueDate}>{item.date}</Text>
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
          <Text style={[styles.issueETA, { color: colors.textSecondary }]}>⏱️ {item.estimatedTime}</Text>
        </View>
      </TouchableOpacity>
      
      {/* Assignment Section */}
      <View style={styles.assignmentSection}>
        <Text style={[styles.assignmentTitle, { color: colors.text }]}>
          {item.assignedTo ? `Assigned to: ${item.assignedTo}` : 'Available Technicians:'}
        </Text>
        
        {!item.assignedTo && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.techniciansList}>
            {technicians
              .filter(t => t.available && t.specialization === item.category || t.specialization === 'General')
              .map(technician => (
                <TouchableOpacity
                  key={technician.id}
                  style={[styles.technicianCard, { backgroundColor: colors.surfaceVariant }]}
                  onPress={() => handleAssignIssue(item, technician)}
                >
                  <Text style={styles.technicianAvatar}>{technician.avatar}</Text>
                  <Text style={[styles.technicianName, { color: colors.text }]}>{technician.name}</Text>
                  <Text style={[styles.technicianLoad, { color: colors.textSecondary }]}>
                    Load: {technician.currentLoad}
                  </Text>
                  <Text style={[styles.technicianRating, { color: colors.primary }]}>
                    ⭐ {technician.rating}
                  </Text>
                </TouchableOpacity>
              ))}
          </ScrollView>
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
        <Text style={[styles.headerTitle, { color: colors.text }]}>Assign Issues</Text>
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
          {renderFilterTab('unassigned', 'Unassigned', '⏳')}
          {renderFilterTab('high-priority', 'High Priority', '🚨')}
        </ScrollView>

        {/* Issues List */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedFilter === 'all' ? 'All Issues' : 
               selectedFilter === 'unassigned' ? 'Unassigned Issues' : 'High Priority Issues'}
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
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Assignment Overview</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {issues.filter(i => !i.assignedTo).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Unassigned</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {technicians.filter(t => t.available).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Available Techs</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#FF9800' }]}>
                {issues.filter(i => ['High', 'Critical'].includes(i.priority) && !i.assignedTo).length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>High Priority</Text>
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
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  issueDate: {
    fontSize: 12,
    color: '#666',
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
    paddingBottom: 15,
  },
  issueReporter: {
    fontSize: 12,
  },
  issueETA: {
    fontSize: 12,
  },
  assignmentSection: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
  },
  assignmentTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  techniciansList: {
    flexDirection: 'row',
  },
  technicianCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
    minWidth: 80,
  },
  technicianAvatar: {
    fontSize: 24,
    marginBottom: 4,
  },
  technicianName: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  technicianLoad: {
    fontSize: 10,
    marginBottom: 2,
  },
  technicianRating: {
    fontSize: 10,
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
});

export default AssignIssuesScreen;
