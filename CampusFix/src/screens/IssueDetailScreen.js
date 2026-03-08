import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const IssueDetailScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { issue } = route.params;
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userData = user || {
    name: 'User',
    email: 'user@example.com',
    role: 'student',
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

  const getTimelineStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#4CAF50';
      case 'current':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      Alert.alert('Success', 'Comment added successfully!');
      setNewComment('');
    } catch (error) {
      Alert.alert('Error', 'Failed to add comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditIssue = () => {
    if (issue.status === 'Resolved') {
      Alert.alert('Cannot Edit', 'This issue has been resolved and cannot be edited.');
      return;
    }
    navigation.navigate('EditIssue', { issue });
  };

  const handleDeleteIssue = () => {
    if (issue.status === 'Resolved') {
      Alert.alert('Cannot Delete', 'This issue has been resolved and cannot be deleted.');
      return;
    }

    Alert.alert(
      'Delete Issue',
      'Are you sure you want to delete this issue? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            const id = issue.id || issue.issue_id;
            await api.delete(`/api/v1/issues/${encodeURIComponent(id)}`);
            Alert.alert('Success', 'Issue deleted successfully!');
            navigation.goBack();
          } catch (err) {
            console.warn('Delete issue error', err?.message || err);
            Alert.alert('Error', 'Failed to delete issue. Please try again.');
          }
        }},
      ]
    );
  };

  const handleGiveFeedback = () => {
    if (issue.status !== 'Resolved') {
      Alert.alert('Not Available', 'Feedback can only be given for resolved issues.');
      return;
    }
    navigation.navigate('Feedback', { issue });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Issue Details</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleEditIssue}
          >
            <Text style={styles.actionButtonText}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={handleDeleteIssue}
          >
            <Text style={styles.actionButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Issue Header */}
        <View style={styles.issueHeader}>
          <Text style={styles.issueTitle}>{issue.title}</Text>
          <View style={styles.statusContainer}>
            <View style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(issue.status) }
            ]}>
              <Text style={styles.statusText}>{issue.status}</Text>
            </View>
            <View style={[
              styles.priorityBadge,
              { backgroundColor: getPriorityColor(issue.priority) }
            ]}>
              <Text style={styles.priorityText}>{issue.priority}</Text>
            </View>
          </View>
        </View>

        {/* Issue Details */}
        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Issue Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Category:</Text>
            <Text style={styles.detailValue}>{issue.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{issue.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date Reported:</Text>
            <Text style={styles.detailValue}>{issue.date}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue}>{issue.description}</Text>
          </View>
        </View>

        {/* Assigned Staff & ETA */}
        <View style={styles.staffSection}>
          <Text style={styles.sectionTitle}>Assignment</Text>
          {issue.assignedTo && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Assigned To:</Text>
              <Text style={styles.detailValue}>{issue.assignedTo}</Text>
            </View>
          )}
          {issue.eta && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Estimated Resolution:</Text>
              <Text style={styles.detailValue}>{issue.eta}</Text>
            </View>
          )}
        </View>

        {/* Timeline */}
        <View style={styles.timelineSection}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          {(issue.timeline || []).map((item, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={[
                styles.timelineDot,
                { backgroundColor: getTimelineStatusColor(item.status) }
              ]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineAction}>{item.action}</Text>
                <Text style={styles.timelineDate}>{item.date}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Comments</Text>
          {(issue.comments || []).map((comment, index) => (
            <View key={index} style={styles.commentItem}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentUser}>{comment.user}</Text>
                <Text style={styles.commentTime}>{comment.time}</Text>
              </View>
              <Text style={styles.commentMessage}>{comment.message}</Text>
            </View>
          ))}
        </View>

        {/* Add Comment */}
        <View style={styles.addCommentSection}>
          <TextInput
            style={styles.commentInput}
            placeholder="Add a comment..."
            placeholderTextColor="#666"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.addCommentButton, isSubmitting && styles.disabledButton]}
            onPress={handleAddComment}
            disabled={isSubmitting}
          >
            <Text style={styles.addCommentButtonText}>
              {isSubmitting ? 'Adding...' : 'Add Comment'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Feedback Button for Resolved Issues */}
        {issue.status === 'Resolved' && (
          <View style={styles.feedbackSection}>
            <TouchableOpacity
              style={styles.feedbackButton}
              onPress={handleGiveFeedback}
            >
              <Text style={styles.feedbackButtonText}>📝 Give Feedback</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  actionButtonText: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  issueHeader: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  issueTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
    fontWeight: '600',
    width: 120,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  staffSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  timelineSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 15,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineAction: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  timelineDate: {
    color: '#888',
    fontSize: 12,
  },
  commentsSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  commentItem: {
    backgroundColor: '#3a3a3a',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  commentUser: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  commentTime: {
    color: '#666',
    fontSize: 12,
  },
  commentMessage: {
    color: '#fff',
    fontSize: 14,
  },
  addCommentSection: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  commentInput: {
    backgroundColor: '#3a3a3a',
    borderRadius: 8,
    padding: 15,
    color: '#fff',
    fontSize: 14,
    marginBottom: 15,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addCommentButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
  },
  addCommentButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  feedbackSection: {
    marginBottom: 20,
  },
  feedbackButton: {
    backgroundColor: '#FF9800',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default IssueDetailScreen;
