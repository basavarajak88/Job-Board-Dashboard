# Job Board Dashboard

A comprehensive React.js application that integrates with the Arbeitnow Jobs API to provide a modern job search experience with advanced filtering, bookmarking, and responsive design.

## Features

### Core Functionality
- **Job Listings**: Browse jobs from the Arbeitnow API with pagination
- **Search & Filters**: Search by title, company, or description with multiple filter options
- **Bookmark System**: Save jobs for later viewing with persistent storage
- **Job Details**: Detailed view with HTML description rendering and apply functionality
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Advanced Features
- **Grid/List View Toggle**: Switch between card grid and list layouts
- **Debounced Search**: 300ms delay for optimal performance
- **Loading States**: Skeleton loaders and smooth transitions
- **Error Handling**: Comprehensive error boundaries and retry mechanisms
- **Performance Optimized**: React.memo, useMemo, and useCallback implementations

## Tech Stack

- **Frontend**: React 19.1.1 with TypeScript
- **State Management**: Redux Toolkit with Redux Persist
- **UI Library**: Material-UI (MUI) v7
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **Date Handling**: date-fns
- **HTML Sanitization**: DOMPurify

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ErrorBoundary/   # Error handling wrapper
│   ├── FilterPanel/     # Job filtering interface
│   ├── JobCard/         # Job display card component
│   ├── LoadingSkeleton/ # Loading state components
│   ├── Navbar/          # Navigation bar
│   └── SearchBar/       # Search input component
├── hooks/               # Custom React hooks
├── pages/               # Route components
│   ├── BookmarksPage.tsx
│   ├── JobDetailsPage.tsx
│   └── JobsPage.tsx
├── services/            # API service layer
├── store/               # Redux store and slices
│   └── slices/
│       ├── bookmarksSlice.ts
│       ├── filtersSlice.ts
│       └── jobsSlice.ts
├── theme/               # MUI theme configuration
└── utils/               # Utility functions
```

## Key Features Breakdown

### Search & Filtering
- **Text Search**: Search across job titles, company names, and descriptions
- **Remote Filter**: All Jobs / Remote Only / On-Site Only
- **Location Filter**: Filter by specific cities or locations
- **Tags Filter**: Filter by job-related tags
- **Job Type Filter**: Filter by employment types
- **Clear Filters**: Reset all filters to default state

### Bookmark System
- **Persistent Storage**: Bookmarks saved using Redux Persist
- **Bookmark Counter**: Real-time count in navigation
- **Quick Actions**: Add/remove bookmarks from job cards and detail view
- **Dedicated Page**: Separate bookmarks page for saved jobs

### Responsive Design
- **Mobile Optimized**: Touch-friendly interface with optimized spacing
- **Tablet Support**: Adaptive layouts for medium screens
- **Desktop Experience**: Full-featured interface with hover effects
- **Grid/List Toggle**: Switch between viewing modes

## API Integration

The application integrates with the [Arbeitnow Jobs API](https://www.arbeitnow.com/api/job-board-api):

- **Base URL**: `https://www.arbeitnow.com/api/job-board-api`
- **Rate Limiting**: Implemented with request caching
- **Error Handling**: Automatic retry with exponential backoff
- **Data Processing**: HTML sanitization and date formatting

## Styling & Theme

- **Material-UI**: Consistent design system
- **Custom Theme**: Centralized color and typography configuration
- **No Inline Styles**: All styling through MUI's sx prop and theme
- **Dark/Light Mode**: Ready for theme switching (can be extended)

## Performance Optimizations

- **Debounced Search**: Reduces API calls during typing
- **React Optimizations**: memo, useMemo, useCallback for re-render prevention
- **Loading Skeletons**: Smooth loading experience
- **Error Boundaries**: Graceful error handling
- **Code Splitting**: Route-based code splitting with React Router

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting with React-specific rules
- **Consistent Formatting**: Standardized code style

##  Deployment

The application is ready for deployment on any static hosting service:

- **Vercel**: `vercel --prod`
- **Netlify**: Drag and drop `dist` folder
- **GitHub Pages**: Push `dist` to gh-pages branch

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

