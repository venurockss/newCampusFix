import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native'; // Added missing import for Text

// Auth Screens
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';

// Main App Screens
import HomeDashboardScreen from '../screens/HomeDashboardScreen';
import MainAppScreen from '../screens/MainAppScreen';

// Issue Management Screens
import ReportIssueScreen from '../screens/ReportIssueScreen';
import IssueStatusScreen from '../screens/IssueStatusScreen';
import IssueDetailScreen from '../screens/IssueDetailScreen';
import AllIssuesScreen from '../screens/AllIssuesScreen';
import EditIssueScreen from '../screens/EditIssueScreen';

// Admin & Technician Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import TechnicianDashboardScreen from '../screens/technician/TechnicianDashboardScreen';

// User Management Screens
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import FeedbackScreen from '../screens/FeedbackScreen';
import AnalyticsScreen from '../screens/admin/AnalyticsScreen';
import AssignIssuesScreen from '../screens/admin/AssignIssuesScreen';
import ResolveIssuesScreen from '../screens/admin/ResolveIssuesScreen';
import ManageUsersScreen from '../screens/admin/ManageUsersScreen';
import GenerateReportsScreen from '../screens/admin/GenerateReportsScreen';

// Profile Management Screens
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import PrivacySettingsScreen from '../screens/profile/PrivacySettingsScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import AboutCampusFixScreen from '../screens/profile/AboutCampusFixScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2a2a2a',
          borderTopColor: '#3a3a3a',
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeDashboardScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🏠</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Issues" 
        component={IssueStatusScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔔</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Admin Tab Navigator
const AdminTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2a2a2a',
          borderTopColor: '#3a3a3a',
        },
        tabBarActiveTintColor: '#FF9800',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="AdminDashboard" 
        component={AdminDashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📊</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📈</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔔</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

// Technician Tab Navigator
const TechnicianTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#2a2a2a',
          borderTopColor: '#3a3a3a',
        },
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="TechnicianDashboard" 
        component={TechnicianDashboardScreen}
        options={{
          tabBarLabel: 'Assigned Issues',
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔧</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Notifications" 
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>🔔</Text>
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#1a1a1a' },
        }}
      >
        {/* Auth Screens */}
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="SignupScreen" component={SignupScreen} />
        
        {/* Main App Screens */}
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
        <Stack.Screen name="AdminApp" component={AdminTabNavigator} />
        <Stack.Screen name="TechnicianApp" component={TechnicianTabNavigator} />
        
                       {/* Issue Management Screens */}
               <Stack.Screen name="ReportIssue" component={ReportIssueScreen} />
               <Stack.Screen name="IssueDetail" component={IssueDetailScreen} />
               <Stack.Screen name="AllIssues" component={AllIssuesScreen} />
               <Stack.Screen name="EditIssue" component={EditIssueScreen} />

               {/* Admin Management Screens */}
               <Stack.Screen name="AssignIssues" component={AssignIssuesScreen} />
               <Stack.Screen name="ResolveIssues" component={ResolveIssuesScreen} />
               <Stack.Screen name="ManageUsers" component={ManageUsersScreen} />
               <Stack.Screen name="GenerateReports" component={GenerateReportsScreen} />
        
                       {/* User Management Screens */}
               <Stack.Screen name="Settings" component={SettingsScreen} />
               <Stack.Screen name="Feedback" component={FeedbackScreen} />

               {/* Profile Management Screens */}
               <Stack.Screen name="EditProfile" component={EditProfileScreen} />
               <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
               <Stack.Screen name="PrivacySettings" component={PrivacySettingsScreen} />
               <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
               <Stack.Screen name="AboutCampusFix" component={AboutCampusFixScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
