# 📝 Task Manager

A modern, intuitive, and feature-rich task management application built with React and TypeScript. Manage your daily tasks efficiently with a clean interface, persistent storage, and real-time statistics.

![Task Manager](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3+-38B2AC.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🌟 Features

### Core Functionality
- ✅ **Add Tasks** - Quickly create new tasks with a simple input interface
- ✅ **Mark as Complete** - Toggle tasks between open and completed states
- ✅ **Delete Tasks** - Remove individual tasks or clear all at once
- ✅ **Persistent Storage** - All tasks are saved to localStorage and persist across browser sessions
- ✅ **Real-time Statistics** - View open, completed, and total task counts at a glance

### User Experience
- 🎨 **Modern UI** - Beautiful gradient backgrounds and smooth animations
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast & Lightweight** - Optimized performance with minimal dependencies
- 🔄 **Instant Updates** - Changes reflect immediately without page reloads
- 🎯 **Visual Feedback** - Color-coded task states and hover effects

### Organization
- 📊 **Task Segregation** - Separate sections for open and completed tasks
- 🔢 **Statistics Dashboard** - Quick overview cards showing task metrics
- 🗑️ **Bulk Actions** - Clear all tasks with a single click
- ✨ **Empty States** - Friendly messages when no tasks are present

---

## 🚀 Demo

### Screenshots

**Main Dashboard**
- Clean interface with input field at the top
- Three statistics cards showing task counts
- Organized task lists with action buttons

**Task States**
- **Open Tasks**: Blue-themed cards with "Mark as Done" and "Delete" buttons
- **Completed Tasks**: Green-themed cards with strikethrough text and "Undo" button

---

## 🛠️ Tech Stack

### Frontend
- **React 18+** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Next-generation frontend tooling

### Storage
- **localStorage API** - Browser-based persistent storage

### Architecture
- Component-based architecture
- TypeScript interfaces for type safety
- React hooks for state management
- Functional components with modern React patterns

---

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/task-manager.git
   cd task-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

---

## 🎮 Usage

### Adding a Task
1. Type your task in the input field at the top
2. Click the "Add Task" button or press Enter
3. Your task will appear in the "Open Tasks" section

### Completing a Task
1. Find the task in the "Open Tasks" section
2. Click the "Mark as Done" button
3. The task will move to the "Completed Tasks" section with strikethrough styling

### Undoing a Completed Task
1. Find the task in the "Completed Tasks" section
2. Click the "Undo" button
3. The task will move back to "Open Tasks"

### Deleting a Task
1. Click the "Delete" button on any task (open or completed)
2. The task will be permanently removed

### Clearing All Tasks
1. Scroll to the bottom of the page
2. Click the "Clear All Tasks" button
3. All tasks will be removed from both sections and localStorage

---

## 📁 Project Structure

```
task-manager/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── InputField.tsx    # Task input component
│   │   └── model.ts          # TypeScript interfaces
│   ├── App.tsx         # Main application component
│   ├── App.css         # Global styles
│   ├── main.tsx        # Application entry point
│   └── index.css       # Tailwind CSS imports
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── vite.config.ts      # Vite configuration
└── README.md          # Project documentation
```

---

## 🧩 Component Breakdown

### `App.tsx`
The main application component that manages:
- Task state using React hooks
- localStorage synchronization
- Task operations (add, delete, complete, clear)
- Statistics calculations
- Rendering of task lists and UI sections

**Key Features:**
- State management with `useState`
- localStorage integration for persistence
- Computed values for statistics
- Event handlers for all user actions

### `InputField.tsx`
A reusable input component that handles:
- Task input field
- Form submission
- Add task button

**Props:**
- `todo`: Current input value
- `setTodo`: Function to update input value
- `handleAdd`: Form submission handler

### `model.ts`
TypeScript type definitions:
```typescript
export interface Todo {
  id: number;        // Unique identifier (timestamp)
  todo: string;      // Task description
  isDone: boolean;   // Completion status
}
```

---

## 🎨 Styling Guide

### Color Scheme
- **Primary Blue**: `#3B82F6` - Open tasks, primary actions
- **Success Green**: `#10B981` - Completed tasks, completion actions
- **Danger Red**: `#EF4444` - Delete actions
- **Purple Accent**: `#8B5CF6` - Statistics
- **Neutral Grays**: Various shades for backgrounds and text

### Design Principles
- **Minimalist**: Clean, uncluttered interface
- **Intuitive**: Clear visual hierarchy and action buttons
- **Responsive**: Mobile-first design approach
- **Accessible**: Proper contrast ratios and interactive states

### Tailwind Classes Used
- Flexbox and Grid layouts
- Gradient backgrounds
- Rounded corners and shadows
- Hover and focus states
- Smooth transitions
- Responsive breakpoints

---

## 💾 Data Persistence

### localStorage Implementation

**Storage Key:** `"todos"`

**Data Format:**
```json
[
  {
    "id": 1704067200000,
    "todo": "Complete project documentation",
    "isDone": false
  },
  {
    "id": 1704153600000,
    "todo": "Review pull requests",
    "isDone": true
  }
]
```

**Operations:**
- **Save**: Automatically saves after every task modification
- **Load**: Reads from localStorage on component mount
- **Clear**: Removes all data when clearing tasks

**Note:** Data is stored in the browser and will persist until:
- The user clears browser data
- The user clicks "Clear All Tasks"
- localStorage is programmatically cleared

---

## 🔧 Configuration

### Tailwind CSS Setup

1. **Installation**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure `tailwind.config.js`**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

3. **Add to `index.css`**
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

---

## 🚀 Build & Deployment

### Build for Production

```bash
npm run build
# or
yarn build
```

This creates an optimized production build in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

### Deployment Options

#### Vercel
```bash
npm install -g vercel
vercel
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy
```

#### GitHub Pages
1. Install gh-pages: `npm install -D gh-pages`
2. Add to `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run: `npm run deploy`

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Add a new task
- [ ] Mark task as complete
- [ ] Undo completed task
- [ ] Delete individual task
- [ ] Clear all tasks
- [ ] Refresh page (verify persistence)
- [ ] Test with empty input
- [ ] Test with long task names
- [ ] Test on mobile device
- [ ] Test in different browsers

### Future Testing Plans
- Unit tests with Vitest
- Component tests with React Testing Library
- E2E tests with Playwright or Cypress

---

## 🐛 Known Issues

Currently no known issues. If you discover a bug, please open an issue on GitHub.

---

## 🗺️ Roadmap

### Version 1.1 (Planned)
- [ ] Edit existing tasks
- [ ] Task categories/tags
- [ ] Due dates
- [ ] Priority levels
- [ ] Search and filter functionality

### Version 1.2 (Future)
- [ ] Dark mode toggle
- [ ] Export tasks (JSON, CSV)
- [ ] Task notes/descriptions
- [ ] Drag and drop reordering
- [ ] Keyboard shortcuts

### Version 2.0 (Long-term)
- [ ] Backend integration
- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Collaboration features
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Contribution Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Update documentation as needed
- Test your changes thoroughly
- Keep pull requests focused on a single feature/fix

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/Developer866)
- Email: opeyemijoseph866@gmail.com

---

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Vite for blazing fast development experience
- The open-source community for inspiration

---

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Reach out via email
- Check the documentation

---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐ on GitHub!

---

**Built with ❤️ using React and TypeScript**