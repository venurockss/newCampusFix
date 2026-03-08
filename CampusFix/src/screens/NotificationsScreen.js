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
import api from '../api/client';

const NotificationsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
  };

  // Notifications will be loaded from backend

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    (async () => {
      try {
        const userId = user?.user_id || user?.id || user?.email || 'unknown';
        const res = await api.get(`/api/v1/notifications/user/${encodeURIComponent(userId)}`);
        const notifs = res.data || [];
        // normalize
        const mapped = notifs.map(n => ({
          id: n.notification_id || n.notificationId || n.id,
          type: n.type || (n.issue_id ? 'issue_update' : 'system'),
          title: n.title,
          message: n.message,
          issueId: n.issue_id,
          issueTitle: n.issue_title || n.issueTitle,
          timestamp: n.created_at || n.timestamp,
          isRead: !!n.is_read,
          priority: n.priority || 'low',
        }));
        setNotifications(mapped);
        setUnreadCount(mapped.filter(n => !n.isRead).length);
      } catch (err) {
        console.warn('Error loading notifications', err?.message || err);
        setNotifications([]);
        setUnreadCount(0);
      }
    })();
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadNotifications();
    setRefreshing(false);
  };

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/api/v1/notifications/${encodeURIComponent(notificationId)}/mark-read`);
      setNotifications(prev => prev.map(notification => notification.id === notificationId ? { ...notification, isRead: true } : notification));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      Alert.alert('Error', 'Failed to mark notification as read.');
    }
  };

  const markAllAsRead = async () => {
    try {
      // Mark each unread notification via API (backend supports single mark endpoint)
      const unread = notifications.filter(n => !n.isRead);
      await Promise.all(unread.map(n => api.put(`/api/v1/notifications/${encodeURIComponent(n.id)}/mark-read`).catch(() => null)));
      setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
      setUnreadCount(0);
      Alert.alert('Success', 'All notifications marked as read!');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark all notifications as read.');
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'issue_update':
        return '📋';
      case 'admin_comment':
        return '💬';
      case 'issue_resolved':
        return '✅';
      case 'system':
        return '🔔';
      default:
        return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return '#f44336';
      case 'medium':
        return '#ff9800';
      case 'low':
        return '#4caf50';
      default:
        return '#666';
    }
  };

  const handleNotificationPress = (notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate to relevant screen
    if (notification.issueId) {
      // Navigate to issue detail
      Alert.alert(
        'View Issue',
        `Would you like to view "${notification.issueTitle}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'View', onPress: () => {
            // In real app, navigate to issue detail
            Alert.alert('Navigation', 'Would navigate to issue detail screen');
          }},
        ]
      );
    } else {
      // System notification
      Alert.alert(notification.title, notification.message);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationCard,
        !item.isRead && styles.unreadCard,
      ]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationHeader}>
        <Text style={styles.notificationIcon}>
          {getNotificationIcon(item.type)}
        </Text>
        <View style={styles.notificationInfo}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.timestamp}</Text>
        </View>
        {!item.isRead && (
          <View style={[
            styles.unreadDot,
            { backgroundColor: getPriorityColor(item.priority) }
          ]} />
        )}
      </View>
      
      <Text style={styles.notificationMessage}>{item.message}</Text>
      
      {item.issueTitle && (
        <View style={styles.issueReference}>
          <Text style={styles.issueReferenceText}>
            📋 {item.issueTitle}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity 
            style={styles.markAllReadButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllReadText}>Mark All Read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Unread Count */}
      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadText}>
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={(item) => item.id}
        style={styles.notificationsList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>
              You're all caught up! New notifications will appear here.
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
  markAllReadButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  markAllReadText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  unreadBanner: {
    backgroundColor: '#FF9800',
    padding: 10,
    alignItems: 'center',
  },
  unreadText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  notificationsList: {
    flex: 1,
    padding: 20,
  },
  notificationCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  unreadCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notificationIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  notificationTime: {
    color: '#666',
    fontSize: 12,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationMessage: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  issueReference: {
    backgroundColor: '#3a3a3a',
    padding: 8,
    borderRadius: 6,
  },
  issueReferenceText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '500',
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

export default NotificationsScreen;
