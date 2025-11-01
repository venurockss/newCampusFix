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
import { useAuth } from '../../context/AuthContext';

const AnalyticsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analyticsData, setAnalyticsData] = useState({});

  const userData = user || {
    name: 'Admin',
    email: 'admin@campus.edu',
    role: 'admin',
  };

  // Mock analytics data
  const mockAnalyticsData = {
    totalIssues: 156,
    resolvedIssues: 142,
    pendingIssues: 14,
    avgResolutionTime: 2.4,
    userSatisfaction: 4.2,
    issuesByCategory: {
      'Facility': 45,
      'Technology': 38,
      'Security': 25,
      'Maintenance': 20,
      'Safety': 18,
      'Other': 10,
    },
    issuesByLocation: {
      'Library': 25,
      'Computer Lab': 20,
      'Lecture Hall': 18,
      'Science Building': 15,
      'Administration': 12,
      'Other': 66,
    },
    resolutionTimeByCategory: {
      'Facility': 1.8,
      'Technology': 3.2,
      'Security': 2.1,
      'Maintenance': 1.5,
      'Safety': 2.8,
      'Other': 2.0,
    },
    monthlyTrends: [
      { month: 'Jan', issues: 45, resolved: 42 },
      { month: 'Feb', issues: 38, resolved: 35 },
      { month: 'Mar', issues: 52, resolved: 48 },
      { month: 'Apr', issues: 41, resolved: 39 },
      { month: 'May', issues: 47, resolved: 44 },
      { month: 'Jun', issues: 43, resolved: 40 },
    ],
    topIssues: [
      { title: 'WiFi Connection Issues', count: 15, avgTime: 2.1 },
      { title: 'Broken Chairs', count: 12, avgTime: 1.5 },
      { title: 'Projector Problems', count: 10, avgTime: 2.8 },
      { title: 'Water Leaks', count: 8, avgTime: 3.2 },
      { title: 'Air Conditioning', count: 7, avgTime: 2.5 },
    ],
  };

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    // Simulate API call
    setAnalyticsData(mockAnalyticsData);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    loadAnalyticsData();
    setRefreshing(false);
  };

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Choose export format:',
      [
        { text: 'Excel (.xlsx)', onPress: () => {
          Alert.alert('Success', 'Data exported to Excel successfully!');
        }},
        { text: 'PDF Report', onPress: () => {
          Alert.alert('Success', 'PDF report generated successfully!');
        }},
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // In real app, reload data for selected period
    Alert.alert('Period Changed', `Analytics data updated for ${period} period.`);
  };

  const renderMetricCard = (title, value, subtitle, color = '#4CAF50') => (
    <View style={styles.metricCard}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={styles.metricTitle}>{title}</Text>
      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderChartBar = (label, value, maxValue, color = '#4CAF50') => (
    <View style={styles.chartBarContainer}>
      <View style={styles.chartBarHeader}>
        <Text style={styles.chartBarLabel}>{label}</Text>
        <Text style={styles.chartBarValue}>{value}</Text>
      </View>
      <View style={styles.chartBarBackground}>
        <View 
          style={[
            styles.chartBarFill, 
            { 
              width: `${(value / maxValue) * 100}%`,
              backgroundColor: color 
            }
          ]} 
        />
      </View>
    </View>
  );

  const renderTopIssueItem = (issue, index) => (
    <View style={styles.topIssueItem}>
      <View style={styles.issueRank}>
        <Text style={styles.rankNumber}>{index + 1}</Text>
      </View>
      <View style={styles.issueInfo}>
        <Text style={styles.issueTitle}>{issue.title}</Text>
        <Text style={styles.issueStats}>
          {issue.count} reports • {issue.avgTime} days avg
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={handleExportData}
        >
          <Text style={styles.exportButtonText}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'week' && styles.selectedPeriodButton,
            ]}
            onPress={() => handlePeriodChange('week')}
          >
            <Text style={styles.periodButtonText}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'month' && styles.selectedPeriodButton,
            ]}
            onPress={() => handlePeriodChange('month')}
          >
            <Text style={styles.periodButtonText}>Month</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'quarter' && styles.selectedPeriodButton,
            ]}
            onPress={() => handlePeriodChange('quarter')}
          >
            <Text style={styles.periodButtonText}>Quarter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.periodButton,
              selectedPeriod === 'year' && styles.selectedPeriodButton,
            ]}
            onPress={() => handlePeriodChange('year')}
          >
            <Text style={styles.periodButtonText}>Year</Text>
          </TouchableOpacity>
        </View>

        {/* Key Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            {renderMetricCard('Total Issues', analyticsData.totalIssues, 'All time')}
            {renderMetricCard('Resolved', analyticsData.resolvedIssues, 'Successfully fixed', '#4CAF50')}
            {renderMetricCard('Pending', analyticsData.pendingIssues, 'Awaiting resolution', '#FF9800')}
            {renderMetricCard('Avg Resolution', `${analyticsData.avgResolutionTime} days`, 'Time to fix', '#2196F3')}
            {renderMetricCard('Satisfaction', `${analyticsData.userSatisfaction}/5`, 'User rating', '#FFC107')}
            {renderMetricCard('Resolution Rate', `${Math.round((analyticsData.resolvedIssues / analyticsData.totalIssues) * 100)}%`, 'Success rate', '#9C27B0')}
          </View>
        </View>

        {/* Issues by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issues by Category</Text>
          <View style={styles.chartContainer}>
            {Object.entries(analyticsData.issuesByCategory || {}).map(([category, count]) => 
              renderChartBar(category, count, Math.max(...Object.values(analyticsData.issuesByCategory || {})))
            )}
          </View>
        </View>

        {/* Issues by Location */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Issues by Location</Text>
          <View style={styles.chartContainer}>
            {Object.entries(analyticsData.issuesByLocation || {}).map(([location, count]) => 
              renderChartBar(location, count, Math.max(...Object.values(analyticsData.issuesByLocation || {})), '#2196F3')
            )}
          </View>
        </View>

        {/* Resolution Time by Category */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Avg Resolution Time by Category</Text>
          <View style={styles.chartContainer}>
            {Object.entries(analyticsData.resolutionTimeByCategory || {}).map(([category, time]) => 
              renderChartBar(category, `${time} days`, Math.max(...Object.values(analyticsData.resolutionTimeByCategory || {})), '#FF9800')
            )}
          </View>
        </View>

        {/* Top Issues */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Most Common Issues</Text>
          <View style={styles.topIssuesContainer}>
            {(analyticsData.topIssues || []).map((issue, index) => 
              renderTopIssueItem(issue, index)
            )}
          </View>
        </View>

        {/* Monthly Trends */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Monthly Trends</Text>
          <View style={styles.trendsContainer}>
            {(analyticsData.monthlyTrends || []).map((trend, index) => (
              <View key={index} style={styles.trendItem}>
                <Text style={styles.trendMonth}>{trend.month}</Text>
                <View style={styles.trendBars}>
                  <View style={[styles.trendBar, { height: (trend.issues / 60) * 100, backgroundColor: '#4CAF50' }]} />
                  <View style={[styles.trendBar, { height: (trend.resolved / 60) * 100, backgroundColor: '#2196F3' }]} />
                </View>
                <Text style={styles.trendLabel}>{trend.issues}</Text>
              </View>
            ))}
          </View>
          <View style={styles.trendLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
              <Text style={styles.legendText}>Total Issues</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2196F3' }]} />
              <Text style={styles.legendText}>Resolved</Text>
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
  exportButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  exportButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  selectedPeriodButton: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metricCard: {
    backgroundColor: '#2a2a2a',
    padding: 15,
    borderRadius: 12,
    flex: 0.48,
    alignItems: 'center',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  metricTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  metricSubtitle: {
    color: '#888',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 2,
  },
  chartContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  chartBarContainer: {
    marginBottom: 15,
  },
  chartBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chartBarLabel: {
    color: '#fff',
    fontSize: 14,
  },
  chartBarValue: {
    color: '#888',
    fontSize: 14,
  },
  chartBarBackground: {
    height: 8,
    backgroundColor: '#3a3a3a',
    borderRadius: 4,
  },
  chartBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  topIssuesContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
  },
  topIssueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  issueRank: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  rankNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  issueInfo: {
    flex: 1,
  },
  issueTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  issueStats: {
    color: '#888',
    fontSize: 12,
  },
  trendsContainer: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendMonth: {
    color: '#fff',
    fontSize: 12,
    marginBottom: 8,
  },
  trendBars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 8,
  },
  trendBar: {
    width: 8,
    borderRadius: 2,
  },
  trendLabel: {
    color: '#888',
    fontSize: 10,
  },
  trendLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 5,
  },
  legendText: {
    color: '#888',
    fontSize: 12,
  },
});

export default AnalyticsScreen;
