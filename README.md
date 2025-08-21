# TodoApp - Modern React Task Management

A feature-rich, responsive todo application built with React, MobX, and modern web technologies. Manage your tasks with advanced filtering, drag-and-drop functionality, and a beautiful dark/light theme system.

![TodoApp Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=TodoApp+Screenshot)

## ✨ Features

### 🎯 Core Functionality

- **Task Management**: Create, edit, delete, and organize todos
- **Priority System**: Customizable priority levels with color coding
- **Status Tracking**: Multiple status options (Todo, In Progress, Done, etc.)
- **Smart Filtering**: Filter by priority, status, completion status, and search
- **Advanced Sorting**: Sort by priority, date, completion status, and more

### 🎨 User Experience

- **Dark/Light Theme**: Automatic theme detection with manual toggle
- **Responsive Design**: Mobile-first design that works on all devices
- **Drag & Drop**: Intuitive reordering of todos and priorities
- **Swipe Actions**: Swipe to delete todos on mobile devices
- **Undo Functionality**: Recover accidentally deleted todos
- **Real-time Updates**: Optimistic UI updates with error handling

### 🔐 Authentication & Security

- **User Registration**: Secure account creation with password validation
- **JWT Authentication**: Token-based authentication with automatic refresh
- **Protected Routes**: Secure access to user-specific data
- **Password Requirements**: Strong password enforcement

### 🚀 Performance & Architecture

- **Server-side Pagination**: Efficient handling of large todo lists
- **MobX State Management**: Reactive state management for smooth UX
- **Optimistic Updates**: Immediate UI feedback with background sync
- **Caching**: Intelligent caching for better performance
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

### Tech Stack

- **Frontend**: React 19.1.1 with React Router DOM 7.8.0
- **State Management**: MobX 6.13.7 with MobX React Lite
- **Styling**: CSS3 with CSS Variables for theming
- **HTTP Client**: Axios with interceptors for authentication
- **Icons**: React Icons 5.5.0
- **Forms**: React Hook Form 7.62.0
- **Testing**: Jest, React Testing Library, Cypress
- **Build Tool**: Create React App 5.0.1

### Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Base UI components (MenuBar, ThemeToggle, etc.)
├── features/           # Feature-based modules
│   ├── todos/          # Todo management
│   ├── priorities/     # Priority management
│   ├── statuses/       # Status management
│   └── users/          # User authentication
├── stores/             # MobX stores
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # App constants
└── config/             # Configuration files
```

### Key Components

#### Todo Management

- `TodoList`: Main todo list with filtering, sorting, and pagination
- `TodoItem`: Individual todo item with inline editing
- `AddTodo`: Form for creating new todos
- `EditTodo`: Dedicated edit page for todos

#### Priority & Status Management

- `PriorityList`: Manage custom priority levels
- `StatusList`: Manage todo status options
- Drag-and-drop reordering for priorities

#### Authentication

- `LoginComponent`: User login form
- `RegisterComponent`: User registration with validation
- `User`: User profile management

## 🚀 Getting Started

### Prerequisites

- Node.js 16.0 or higher
- npm or yarn package manager
- Backend API server (see backend documentation)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Joossensei/react-todo.git
   cd react-todo/frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_BASE_URL=http://localhost:8000
   REACT_APP_ENVIRONMENT=development
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   The app will open at [http://localhost:3000](http://localhost:3000)

### Available Scripts

| Command                | Description                         |
| ---------------------- | ----------------------------------- |
| `npm start`            | Runs the app in development mode    |
| `npm test`             | Launches the test runner            |
| `npm run build`        | Builds the app for production       |
| `npm run cypress:open` | Opens Cypress test runner           |
| `npm run cypress:run`  | Runs Cypress tests in headless mode |

## 📱 Usage Guide

### Creating Your First Todo

1. **Register an Account**
   - Navigate to `/register`
   - Fill in your details and create a strong password
   - You'll be automatically logged in after registration

2. **Add a Todo**
   - Click the "Add Todo" button on the main page
   - Fill in the title and optional description
   - Select a priority level (if configured)
   - Choose a status
   - Click "Add Todo"

3. **Manage Your Todos**
   - **Edit**: Click the edit icon or double-click the todo
   - **Complete**: Click the checkbox to mark as done
   - **Delete**: Swipe left on mobile or click the trash icon
   - **Change Priority/Status**: Use the dropdown menus on each todo

### Advanced Features

#### Filtering & Sorting

- **Search**: Use the search bar to find specific todos
- **Filter by Priority**: Click the priority filter to show specific priority levels
- **Filter by Status**: Use the status filter to show todos by status
- **Sort**: Choose from various sorting options (priority, date, completion)

#### Theme Customization

- **Automatic**: The app detects your system theme preference
- **Manual Toggle**: Use the theme toggle in the menu bar
- **Persistent**: Your theme choice is saved for future visits

#### Priority Management

- Navigate to `/priorities` to manage priority levels
- Create custom priorities with colors and icons
- Drag to reorder priority levels
- Priorities are used across all todos

#### Status Management

- Navigate to `/statuses` to manage status options
- Create custom statuses for your workflow
- Statuses help track todo progress

## 🔧 Configuration

### API Configuration

The app connects to a backend API. Configure the API endpoints in `src/constants/apiEndpoints.js`:

```javascript
export const API_ENDPOINTS = {
  TODOS: {
    LIST: "/todos",
    CREATE: "/todos",
    GET: (key) => `/todo/${key}`,
    UPDATE: (key) => `/todo/${key}`,
    DELETE: (key) => `/todo/${key}`,
  },
  // ... other endpoints
};
```

### Theme Configuration

Customize themes by modifying CSS variables in `src/index.css`:

```css
:root {
  --primary-bg: #ffffff;
  --text-primary: #333333;
  --accent-color: #667eea;
  /* ... other variables */
}

[data-theme="dark"] {
  --primary-bg: #1a1a1a;
  --text-primary: #ffffff;
  --accent-color: #8b5cf6;
  /* ... other variables */
}
```

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Deployment Options

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your repository for automatic deployments
- **AWS S3**: Upload the `build` folder to an S3 bucket
- **Docker**: Use the provided Dockerfile for containerized deployment

### Environment Variables for Production

```env
REACT_APP_API_BASE_URL=https://your-api-domain.com
REACT_APP_ENVIRONMENT=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and structure
- Write tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **MobX** for reactive state management
- **React Icons** for the beautiful icon library
- **Cursor** for AI-powered development assistance

## 📞 Support

- **Issues**: Report bugs and request features on GitHub
- **Documentation**: Check the inline code comments for detailed explanations
- **Community**: Join our community discussions

---

**Made with ❤️ by [Joost Both](https://github.com/Joossensei) & [Cursor](https://cursor.com)**
