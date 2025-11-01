import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../../context/ThemeContext';

const GenerateReportsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState(null);

  // Mock report data
  const mockReportData = {
    issuesByCategory: {
      'Technology': 45,
      'Facility': 32,
      'Security': 18,
      'Maintenance': 25,
      'Cleaning': 12,
    },
    issuesByStatus: {
      'Pending': 23,
      'In Progress': 15,
      'Resolved': 89,
      'Closed': 12,
    },
    resolutionTime: {
      '0-24 hours': 45,
      '1-3 days': 32,
      '3-7 days': 18,
      '1+ weeks': 8,
    },
    monthlyTrends: {
      'Jan': 45,
      'Feb': 52,
      'Mar': 38,
      'Apr': 61,
      'May': 47,
      'Jun': 55,
    },
    topReporters: [
      { name: 'John Doe', count: 12, role: 'Student' },
      { name: 'Sarah Smith', count: 8, role: 'Faculty' },
      { name: 'Mike Wilson', count: 6, role: 'Student' },
      { name: 'Dr. Johnson', count: 5, role: 'Faculty' },
    ],
    technicianPerformance: [
      { name: 'Alex Johnson', resolved: 45, rating: 4.9, avgTime: '2.1 days' },
      { name: 'Tom Brown', resolved: 38, rating: 4.6, avgTime: '2.8 days' },
      { name: 'Sam Davis', resolved: 32, rating: 4.4, avgTime: '3.2 days' },
    ],
  };

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    setReportData(mockReportData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadReportData();
    setRefreshing(false);
  };

  const handleGenerateReport = (reportType) => {
    setSelectedReport(reportType);
    Alert.alert(
      'Generate Report',
      `Generate ${reportType} report?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Generate', 
          onPress: async () => {
            try {
              // Simulate report generation
              await new Promise(resolve => setTimeout(resolve, 2000));
              Alert.alert('Success', `${reportType} report generated successfully!`);
            } catch (error) {
              Alert.alert('Error', 'Failed to generate report. Please try again.');
            }
          }
        },
      ]
    );
  };

  const handleExportReport = (reportType) => {
    Alert.alert(
      'Export Report',
      `Export ${reportType} report as:`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF', onPress: () => Alert.alert('Success', 'Report exported as PDF!') },
        { text: 'Excel', onPress: () => Alert.alert('Success', 'Report exported as Excel!') },
        { text: 'CSV', onPress: () => Alert.alert('Success', 'Report exported as CSV!') },
      ]
    );
  };

  const renderReportCard = (title, description, icon, reportType) => (
    <View style={[styles.reportCard, { backgroundColor: colors.surface }]}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportIcon}>{icon}</Text>
        <View style={styles.reportInfo}>
          <Text style={[styles.reportTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.reportDescription, { color: colors.textSecondary }]}>{description}</Text>
        </View>
      </View>
      
      <View style={styles.reportActions}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.primary }]}
          onPress={() => handleGenerateReport(reportType)}
        >
          <Text style={styles.actionButtonText}>📊 Generate</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: colors.surfaceVariant }]}
          onPress={() => handleExportReport(reportType)}
        >
          <Text style={[styles.actionButtonText, { color: colors.text }]}>📤 Export</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDataVisualization = () => {
    if (!reportData) return null;

    return (
      <View style={styles.visualizationSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Data Overview</Text>
        
        {/* Issues by Category */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Issues by Category</Text>
          <View style={styles.chartContainer}>
            {Object.entries(reportData.issuesByCategory).map(([category, count]) => (
              <View key={category} style={styles.chartBar}>
                <View style={[styles.barFill, { 
                  height: (count / Math.max(...Object.values(reportData.issuesByCategory))) * 100,
                  backgroundColor: colors.primary 
                }]} />
                <Text style={[styles.barLabel, { color: colors.textSecondary }]}>{category}</Text>
                <Text style={[styles.barValue, { color: colors.text }]}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Issues by Status */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Issues by Status</Text>
          <View style={styles.statusChart}>
            {Object.entries(reportData.issuesByStatus).map(([status, count]) => (
              <View key={status} style={styles.statusItem}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(status) }]} />
                <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
                <Text style={[styles.statusCount, { color: colors.textSecondary }]}>{count}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Top Reporters */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Top Reporters</Text>
          {reportData.topReporters.map((reporter, index) => (
            <View key={reporter.name} style={styles.reporterItem}>
              <Text style={[styles.rankNumber, { color: colors.primary }]}>#{index + 1}</Text>
              <View style={styles.reporterInfo}>
                <Text style={[styles.reporterName, { color: colors.text }]}>{reporter.name}</Text>
                <Text style={[styles.reporterRole, { color: colors.textSecondary }]}>{reporter.role}</Text>
              </View>
              <Text style={[styles.reporterCount, { color: colors.primary }]}>{reporter.count} issues</Text>
            </View>
          ))}
        </View>

        {/* Technician Performance */}
        <View style={[styles.chartCard, { backgroundColor: colors.surface }]}>
          <Text style={[styles.chartTitle, { color: colors.text }]}>Technician Performance</Text>
          {reportData.technicianPerformance.map((tech, index) => (
            <View key={tech.name} style={styles.techItem}>
              <View style={styles.techHeader}>
                <Text style={[styles.techName, { color: colors.text }]}>{tech.name}</Text>
                <Text style={[styles.techRating, { color: colors.primary }]}>⭐ {tech.rating}</Text>
              </View>
              <View style={styles.techStats}>
                <Text style={[styles.techStat, { color: colors.textSecondary }]}>
                  Resolved: {tech.resolved}
                </Text>
                <Text style={[styles.techStat, { color: colors.textSecondary }]}>
                  Avg Time: {tech.avgTime}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return '#FF9800';
      case 'In Progress': return '#2196F3';
      case 'Resolved': return '#4CAF50';
      case 'Closed': return '#666';
      default: return '#666';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style="light" />
      
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={[styles.backButton, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Generate Reports</Text>
        <View style={{ width: 50 }} />
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Report Types */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Available Reports</Text>
          
          {renderReportCard(
            'Issue Summary Report',
            'Comprehensive overview of all issues with status, priority, and resolution times',
            '📋',
            'Issue Summary'
          )}
          
          {renderReportCard(
            'Performance Analytics',
            'Detailed analysis of technician performance and issue resolution metrics',
            '📊',
            'Performance Analytics'
          )}
          
          {renderReportCard(
            'Category Analysis',
            'Breakdown of issues by category, location, and priority levels',
            '🏷️',
            'Category Analysis'
          )}
          
          {renderReportCard(
            'User Activity Report',
            'User engagement metrics and reporting patterns',
            '👥',
            'User Activity'
          )}
          
          {renderReportCard(
            'Monthly Trends',
            'Monthly issue trends and seasonal patterns analysis',
            '📈',
            'Monthly Trends'
          )}
          
          {renderReportCard(
            'Custom Report',
            'Generate custom reports with specific filters and criteria',
            '⚙️',
            'Custom Report'
          )}
        </View>

        {/* Data Visualization */}
        {renderDataVisualization()}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: colors.primary }]}
              onPress={() => Alert.alert('Coming Soon', 'Automated reporting will be implemented.')}
            >
              <Text style={styles.quickActionText}>🔄 Schedule Reports</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.quickActionButton, { backgroundColor: colors.surfaceVariant }]}
              onPress={() => Alert.alert('Coming Soon', 'Report templates will be implemented.')}
            >
              <Text style={[styles.quickActionText, { color: colors.text }]}>📝 Report Templates</Text>
            </TouchableOpacity>
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
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  reportCard: { borderRadius: 12, marginBottom: 15, overflow: 'hidden' },
  reportHeader: { flexDirection: 'row', padding: 15, paddingBottom: 10 },
  reportIcon: { fontSize: 32, marginRight: 15 },
  reportInfo: { flex: 1 },
  reportTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  reportDescription: { fontSize: 14, lineHeight: 20 },
  reportActions: { flexDirection: 'row', padding: 15, borderTopWidth: 1, borderTopColor: '#3a3a3a', gap: 10 },
  actionButton: { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderRadius: 8, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  visualizationSection: { marginBottom: 25 },
  chartCard: { borderRadius: 12, marginBottom: 15, padding: 15 },
  chartTitle: { fontSize: 16, fontWeight: '600', marginBottom: 15 },
  chartContainer: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', height: 120 },
  chartBar: { alignItems: 'center', flex: 1 },
  barFill: { width: 20, borderRadius: 10, marginBottom: 8 },
  barLabel: { fontSize: 10, textAlign: 'center', marginBottom: 4 },
  barValue: { fontSize: 12, fontWeight: '600' },
  statusChart: { gap: 10 },
  statusItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: 10 },
  statusText: { flex: 1, fontSize: 14 },
  statusCount: { fontSize: 14, fontWeight: '600' },
  reporterItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  rankNumber: { fontSize: 16, fontWeight: 'bold', marginRight: 15, minWidth: 30 },
  reporterInfo: { flex: 1 },
  reporterName: { fontSize: 14, fontWeight: '500', marginBottom: 2 },
  reporterRole: { fontSize: 12 },
  reporterCount: { fontSize: 14, fontWeight: '600' },
  techItem: { marginBottom: 15, paddingBottom: 15, borderBottomWidth: 1, borderBottomColor: '#3a3a3a' },
  techHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  techName: { fontSize: 14, fontWeight: '500' },
  techRating: { fontSize: 14 },
  techStats: { flexDirection: 'row', gap: 20 },
  techStat: { fontSize: 12 },
  quickActions: { flexDirection: 'row', gap: 10 },
  quickActionButton: { flex: 1, padding: 15, borderRadius: 10, alignItems: 'center' },
  quickActionText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

export default GenerateReportsScreen;
