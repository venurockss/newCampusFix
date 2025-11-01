# CampusFix - Campus Issue Management App

A comprehensive React Native mobile application for managing campus issues, complaints, and maintenance requests. Built with role-based access control for students, faculty, administrators, and technicians.

## 🚀 Features

### 🔐 Authentication & User Management
- **Role-based Login**: Student, Faculty, Admin, Technician
- **Secure Authentication**: JWT tokens with persistent sessions
- **Email + Password**: Traditional login system
- **User Profile Management**: Edit profile, change password, settings

### 🏠 Home Dashboard
- **Personalized Greeting**: Time-based welcome messages
- **Quick Actions**: Report new issue, view status
- **Statistics Overview**: Total, resolved, pending, in-progress issues
- **Recent Issues**: Latest submitted complaints with status
- **Quick Tips**: Helpful guidance for users

### 📝 Issue Reporting System
- **Comprehensive Form**: Title, description, location, category, priority
- **Category Selection**: Facility, Technology, Security, Maintenance, Safety, Other
- **Priority Levels**: Low, Medium, High, Critical
- **Photo Upload**: Take photos or select from gallery (placeholder)
- **Voice-to-Text**: Speech-to-text functionality (placeholder)
- **Auto-suggested Category**: ML-powered category detection (placeholder)
- **Location Detection**: Auto-detect building/room (placeholder)

### 📊 Issue Status & History
- **Status Tracking**: Pending, In Progress, Resolved
- **Timeline View**: Complete issue lifecycle tracking
- **Filter System**: Filter by status, category, date
- **Search Functionality**: Search through all issues
- **Detailed View**: Full issue information with comments

### 💬 Issue Detail & Communication
- **Full Issue View**: Complete complaint details
- **Image Preview**: Photo attachments display
- **Assigned Staff**: Technician assignment information
- **Resolution ETA**: Estimated completion time
- **Comments Section**: Chat-like communication
- **Edit/Delete**: Modify issues before resolution
- **Feedback System**: Rate resolved issues

### 🔔 Notifications System
- **Push Notifications**: Real-time updates
- **In-app Notifications**: Issue updates, admin comments, resolutions
- **Notification Types**: Issue updates, comments, resolutions, system messages
- **Mark as Read**: Individual and bulk read status
- **Priority Indicators**: Color-coded notification importance

### 👨‍💼 Admin Panel
- **Dashboard Overview**: Key metrics and statistics
- **Issue Management**: Assign, resolve, track all issues
- **User Management**: Manage student, faculty, technician accounts
- **Quick Actions**: Bulk operations and assignments
- **System Health**: Monitor app performance and status

### 🔧 Technician Interface
- **Assigned Issues**: View and manage assigned tasks
- **Work Progress**: Start work, update status, mark resolved
- **Resolution Proof**: Upload photos and notes as proof
- **Issue Details**: Complete information for each assignment
- **Progress Tracking**: Real-time status updates

### 📈 Analytics & Reports
- **Key Metrics**: Total issues, resolution rate, satisfaction scores
- **Category Analysis**: Issues by type and location
- **Resolution Times**: Average time by category
- **Trend Analysis**: Monthly and quarterly trends
- **Top Issues**: Most common problems and patterns
- **Export Functionality**: Excel and PDF reports
- **Period Selection**: Week, month, quarter, year views

### ⭐ Feedback & Ratings
- **Star Rating System**: 1-5 star satisfaction ratings
- **Comment System**: Detailed feedback and suggestions
- **Quick Feedback**: Pre-defined satisfaction indicators
- **Sentiment Analysis**: NLP-powered comment analysis (placeholder)
- **Rating History**: View past feedback and ratings

### ⚙️ Settings & Profile
- **Profile Management**: Edit personal information
- **Password Security**: Change password functionality
- **Notification Preferences**: Customize notification settings
- **Privacy Settings**: Manage data and privacy options
- **App Settings**: Dark mode, auto-location, cache management
- **Data Export**: Download personal data
- **Help & Support**: Access to help resources

### 📱 Advanced Features
- **Dark Theme**: Modern dark UI design
- **Responsive Design**: Optimized for all screen sizes
- **Offline Support**: Basic offline functionality
- **Real-time Updates**: Live status changes
- **Multi-language Support**: Internationalization ready
- **Accessibility**: Screen reader and accessibility support

## 🛠 Technical Implementation

### Core Technologies
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tools
- **React Navigation**: Screen navigation and routing
- **AsyncStorage**: Local data persistence
- **Context API**: Global state management

### Architecture
- **Component-based**: Reusable UI components
- **Role-based Routing**: Different app experiences per user type
- **Tab Navigation**: Bottom tab navigation for main features
- **Stack Navigation**: Screen-to-screen navigation
- **State Management**: React Context for global state

### Data Flow
- **Authentication Flow**: Login → Role Detection → App Navigation
- **Issue Lifecycle**: Report → Assign → Work → Resolve → Feedback
- **Notification System**: Real-time updates and alerts
- **Analytics Pipeline**: Data collection → Processing → Visualization

## 📱 User Roles & Access

### 👨‍🎓 Student
- Report issues and track progress
- View personal issue history
- Receive notifications and updates
- Provide feedback on resolved issues
- Access help and support resources

### 👨‍🏫 Faculty
- All student features
- Report department-specific issues
- View faculty-specific analytics
- Access enhanced reporting tools

### 👨‍💼 Administrator
- Full system access and control
- Manage all users and issues
- View comprehensive analytics
- Generate reports and exports
- System configuration and settings

### 🔧 Technician
- View assigned issues
- Update work progress
- Mark issues as resolved
- Upload resolution proof
- Access work history and analytics

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- Android Studio / Xcode (for device testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusFix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app
   - Press 'a' for Android emulator
   - Press 'i' for iOS simulator

### Testing Different Roles

1. **Student Login**
   - Email: `student@campus.edu`
   - Password: `password123`
   - Role: `student`

2. **Faculty Login**
   - Email: `faculty@campus.edu`
   - Password: `password123`
   - Role: `faculty`

3. **Admin Login**
   - Email: `admin@campus.edu`
   - Password: `password123`
   - Role: `admin`

4. **Technician Login**
   - Email: `technician@campus.edu`
   - Password: `password123`
   - Role: `technician`

## 📁 Project Structure

```
CampusFix/
├── App.js                          # Main app entry point
├── src/
│   ├── context/
│   │   └── AuthContext.js         # Authentication context
│   ├── navigation/
│   │   └── AppNavigator.js        # Navigation configuration
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js     # Login screen
│   │   │   └── SignupScreen.js    # Registration screen
│   │   ├── admin/
│   │   │   ├── AdminDashboardScreen.js
│   │   │   └── AnalyticsScreen.js
│   │   ├── technician/
│   │   │   └── TechnicianDashboardScreen.js
│   │   ├── HomeDashboardScreen.js # Main dashboard
│   │   ├── ReportIssueScreen.js   # Issue reporting
│   │   ├── IssueStatusScreen.js   # Issue tracking
│   │   ├── IssueDetailScreen.js   # Issue details
│   │   ├── AllIssuesScreen.js     # All issues view
│   │   ├── NotificationsScreen.js # Notifications
│   │   ├── ProfileScreen.js       # User profile
│   │   ├── SettingsScreen.js      # App settings
│   │   └── FeedbackScreen.js      # Feedback system
│   └── components/                 # Reusable components
└── README.md
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
API_BASE_URL=your_api_url
FIREBASE_CONFIG=your_firebase_config
```

### API Integration
The app currently uses mock data. To integrate with a real backend:

1. Replace mock API calls with actual endpoints
2. Implement proper error handling
3. Add loading states and retry logic
4. Configure push notifications
5. Set up analytics tracking

## 📊 Analytics & Insights

### Key Metrics Tracked
- Total issues reported
- Resolution rate and time
- User satisfaction scores
- Category-wise distribution
- Location-based analysis
- Technician performance
- Trend analysis

### Report Types
- **Executive Summary**: High-level overview
- **Detailed Analytics**: Comprehensive breakdown
- **Performance Reports**: Technician and system metrics
- **Trend Analysis**: Time-based patterns
- **Export Options**: Excel, PDF, CSV formats

## 🔮 Future Enhancements

### Planned Features
- **AI-Powered Issue Classification**: Automatic category detection
- **Predictive Analytics**: Issue prediction and prevention
- **Voice Commands**: Voice-to-text for issue reporting
- **AR Integration**: Augmented reality for issue visualization
- **IoT Integration**: Smart campus sensors and automation
- **Multi-language Support**: Internationalization
- **Advanced Analytics**: Machine learning insights
- **Mobile Payments**: Premium features and subscriptions

### Technical Improvements
- **Real-time Sync**: WebSocket integration
- **Offline Mode**: Complete offline functionality
- **Push Notifications**: Firebase Cloud Messaging
- **Performance Optimization**: Code splitting and lazy loading
- **Testing Suite**: Unit and integration tests
- **CI/CD Pipeline**: Automated deployment

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review the FAQ section

## 🙏 Acknowledgments

- React Native community
- Expo development team
- UI/UX design inspiration
- Beta testers and feedback providers

---

**CampusFix** - Making campus management smarter, one issue at a time! 🎓✨
