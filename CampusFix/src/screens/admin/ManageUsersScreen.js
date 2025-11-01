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

const ManageUsersScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [users, setUsers] = useState([]);

  // Mock data for users
  const mockUsers = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john.doe@campus.edu',
      role: 'Student',
      status: 'Active',
      department: 'Computer Science',
      avatar: '👨‍🎓',
      issuesReported: 5,
      issuesResolved: 3,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah.smith@campus.edu',
      role: 'Faculty',
      status: 'Active',
      department: 'Engineering',
      avatar: '👩‍🏫',
      issuesReported: 8,
      issuesResolved: 6,
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike.wilson@campus.edu',
      role: 'Technician',
      status: 'Active',
      department: 'IT Services',
      avatar: '👨‍💻',
      issuesReported: 0,
      issuesResolved: 45,
      rating: 4.8,
    },
    {
      id: '4',
      name: 'Dr. Johnson',
      email: 'dr.johnson@campus.edu',
      role: 'Faculty',
      status: 'Active',
      department: 'Chemistry',
      avatar: '👨‍🔬',
      issuesReported: 12,
      issuesResolved: 8,
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUsers(mockUsers);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadData();
    setRefreshing(false);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return '#f44336';
      case 'Faculty': return '#2196f3';
      case 'Technician': return '#4caf50';
      case 'Student': return '#ff9800';
      default: return '#666';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#4CAF50';
      case 'Inactive': return '#666';
      default: return '#666';
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'active' && user.status === 'Active') ||
                         (selectedFilter === 'students' && user.role === 'Student') ||
                         (selectedFilter === 'faculty' && user.role === 'Faculty') ||
                         (selectedFilter === 'technicians' && user.role === 'Technician');
    
    return matchesSearch && matchesFilter;
  });

  const handleToggleStatus = (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    const action = newStatus === 'Active' ? 'activate' : 'deactivate';
    
    Alert.alert(
      `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
      `Are you sure you want to ${action} ${user.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: action.charAt(0).toUpperCase() + action.slice(1), 
          onPress: async () => {
            try {
              await new Promise(resolve => setTimeout(resolve, 1000));
              const updatedUsers = users.map(u => 
                u.id === user.id ? { ...u, status: newStatus } : u
              );
              setUsers(updatedUsers);
              Alert.alert('Success', `User ${action}d successfully!`);
            } catch (error) {
              Alert.alert('Error', `Failed to ${action} user. Please try again.`);
            }
          }
        },
      ]
    );
  };

  const handleUserPress = (user) => {
    Alert.alert(
      user.name,
      `Role: ${user.role}\nDepartment: ${user.department}\nEmail: ${user.email}\n\nStatus: ${user.status}\nIssues Reported: ${user.issuesReported}\nIssues Resolved: ${user.issuesResolved}`,
      [
        { text: 'Edit User', onPress: () => Alert.alert('Coming Soon', 'Edit functionality will be implemented.') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderUserCard = ({ item }) => (
    <View style={[styles.userCard, { backgroundColor: colors.surface }]}>
      <TouchableOpacity onPress={() => handleUserPress(item)}>
        <View style={styles.userHeader}>
          <Text style={styles.userAvatar}>{item.avatar}</Text>
          
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.text }]}>{item.name}</Text>
            <Text style={[styles.userEmail, { color: colors.textSecondary }]}>{item.email}</Text>
            <Text style={[styles.userDepartment, { color: colors.textSecondary }]}>{item.department}</Text>
          </View>
          
          <View style={styles.userBadges}>
            <View style={[styles.roleBadge, { backgroundColor: getRoleColor(item.role) }]}>
              <Text style={styles.roleText}>{item.role}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{item.status}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.userStats}>
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>📊</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Reported</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.issuesReported}</Text>
          </View>
          
          <View style={styles.statItem}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Resolved</Text>
            <Text style={[styles.statValue, { color: colors.text }]}>{item.issuesResolved}</Text>
          </View>
        </View>
      </TouchableOpacity>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => Alert.alert('Coming Soon', 'Edit functionality will be implemented.')}
        >
          <Text style={styles.actionButtonText}>✏️ Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: item.status === 'Active' ? '#FF9800' : '#4CAF50' }]}
          onPress={() => handleToggleStatus(item)}
        >
          <Text style={styles.actionButtonText}>
            {item.status === 'Active' ? '⏸️ Deactivate' : '▶️ Activate'}
          </Text>
        </TouchableOpacity>
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
      <Text style={[styles.filterText, { color: selectedFilter === filter ? '#fff' : colors.text }]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Manage Users</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.searchContainer, { backgroundColor: colors.surface }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.text, backgroundColor: colors.surfaceVariant }]}
            placeholder="Search users by name or email..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterTabs}>
          {renderFilterTab('all', 'All Users', '👥')}
          {renderFilterTab('active', 'Active', '🟢')}
          {renderFilterTab('students', 'Students', '👨‍🎓')}
          {renderFilterTab('faculty', 'Faculty', '👨‍🏫')}
          {renderFilterTab('technicians', 'Technicians', '🔧')}
        </ScrollView>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {selectedFilter === 'all' ? 'All Users' : 
               selectedFilter === 'active' ? 'Active Users' : 
               selectedFilter === 'students' ? 'Students' :
               selectedFilter === 'faculty' ? 'Faculty' : 'Technicians'}
            </Text>
            <Text style={[styles.userCount, { color: colors.textSecondary }]}>
              {filteredUsers.length} users
            </Text>
          </View>
          
          {filteredUsers.length > 0 ? (
            <FlatList
              data={filteredUsers}
              renderItem={renderUserCard}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface }]}>
              <Text style={styles.emptyIcon}>📭</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No Users Found</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                {searchQuery ? 'Try adjusting your search terms' : 'No users match the selected filter'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>User Overview</Text>
          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {users.filter(u => u.status === 'Active').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#FF9800' }]}>
                {users.filter(u => u.role === 'Student').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Students</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>
                {users.filter(u => u.role === 'Faculty').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Faculty</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {users.filter(u => u.role === 'Technician').length}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Technicians</Text>
            </View>
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
  filterTabs: { marginBottom: 20 },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  filterIcon: { fontSize: 16, marginRight: 6 },
  filterText: { fontSize: 14, fontWeight: '500' },
  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  userCount: { fontSize: 14 },
  userCard: { borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  userHeader: { flexDirection: 'row', padding: 15, paddingBottom: 10 },
  userAvatar: { fontSize: 40, marginRight: 15 },
  userInfo: { flex: 1, justifyContent: 'center' },
  userName: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  userEmail: { fontSize: 14, marginBottom: 2 },
  userDepartment: { fontSize: 12 },
  userBadges: { alignItems: 'flex-end' },
  roleBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginBottom: 6 },
  roleText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  userStats: { flexDirection: 'row', paddingHorizontal: 15, paddingBottom: 15, gap: 15 },
  statItem: { alignItems: 'center', minWidth: 60 },
  statIcon: { fontSize: 16, marginBottom: 4 },
  statLabel: { fontSize: 10, marginBottom: 2, textAlign: 'center' },
  statValue: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    gap: 10,
  },
  actionButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  emptyState: { alignItems: 'center', padding: 40, borderRadius: 12 },
  emptyIcon: { fontSize: 48, marginBottom: 15 },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  emptyText: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  statsContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  statCard: { flex: 1, alignItems: 'center', padding: 15, borderRadius: 12, marginHorizontal: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  statLabel: { fontSize: 12, textAlign: 'center' },
});

export default ManageUsersScreen;
