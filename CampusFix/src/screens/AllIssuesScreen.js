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
  TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';

const AllIssuesScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [issues, setIssues] = useState([]);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
  };

  // Mock data for all issues
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
    },
    {
      id: '4',
      title: 'Projector Not Working',
      category: 'Technology',
      status: 'Resolved',
      priority: 'Medium',
      date: '2024-01-12',
      location: 'Lecture Hall - Room 301',
      description: 'Projector screen is not displaying properly',
      assignedTo: 'Tom Brown',
      eta: '2024-01-15',
    },
    {
      id: '5',
      title: 'Air Conditioning Issue',
      category: 'Facility',
      status: 'Resolved',
      priority: 'Low',
      date: '2024-01-11',
      location: 'Administration Building - Floor 1',
      description: 'AC is making loud noise',
      assignedTo: 'David Wilson',
      eta: '2024-01-14',
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
    let filtered = issues;

    // Filter by status
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(issue => 
        issue.status.toLowerCase() === selectedFilter.toLowerCase()
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(issue => 
        issue.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const handleIssuePress = (issue) => {
    navigation.navigate('IssueDetail', { issue });
  };

  const handleFilterPress = (filter) => {
    setSelectedFilter(filter);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
  };

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
      <Text style={styles.issueDate}>📅 {item.date}</Text>
      
      {item.assignedTo && (
        <Text style={styles.assignedTo}>👤 Assigned to: {item.assignedTo}</Text>
      )}
      
      {item.eta && (
        <Text style={styles.eta}>⏰ ETA: {item.eta}</Text>
      )}
    </TouchableOpacity>
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

  const renderCategoryButton = (category, label) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === category && styles.selectedCategoryButton,
      ]}
      onPress={() => handleCategoryPress(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText,
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
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Issues</Text>
        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportIssue')}
        >
          <Text style={styles.reportButtonText}>+ Report</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search issues..."
          placeholderTextColor="#666"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'All')}
          {renderFilterButton('pending', 'Pending')}
          {renderFilterButton('in progress', 'In Progress')}
          {renderFilterButton('resolved', 'Resolved')}
        </ScrollView>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderCategoryButton('all', 'All')}
          {renderCategoryButton('facility', 'Facility')}
          {renderCategoryButton('technology', 'Technology')}
          {renderCategoryButton('security', 'Security')}
          {renderCategoryButton('maintenance', 'Maintenance')}
        </ScrollView>
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
              {searchQuery 
                ? 'No issues match your search criteria'
                : 'You haven\'t reported any issues yet'
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
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  reportButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  searchInput: {
    backgroundColor: '#3a3a3a',
    borderRadius: 10,
    padding: 15,
    color: '#fff',
    fontSize: 16,
  },
  filtersContainer: {
    paddingHorizontal: 20,
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
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  categoryButton: {
    backgroundColor: '#3a3a3a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  selectedCategoryButton: {
    backgroundColor: '#2196F3',
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  selectedCategoryText: {
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

export default AllIssuesScreen;
