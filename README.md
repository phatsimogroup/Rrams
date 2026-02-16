# RRAMS - Road & Runway Asset Management System

A comprehensive asset management system built with React + TypeScript for managing road infrastructure, condition assessments, and traffic data.

## Features

### Admin Module
- User & role management
- System configuration
- Announcements management
- Analytics dashboard

### Engineer Module
- Asset data capture forms
- Condition assessment with photo/GPS
- Traffic count recording
- Offline data sync capability
- Interactive map view

### Viewer Module
- Read-only dashboards
- Map visualization
- Report export (PDF, Excel, TMH18)
- Notifications view

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand
- **Forms**: React Hook Form
- **Maps**: Leaflet + React Leaflet
- **Charts**: Recharts
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite

## Installation

```bash
# Install dependencies
npm install

# Copy environment variables
copy .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── auth/          # Authentication components
│   ├── layout/        # Layout components
│   └── common/        # Reusable components
├── modules/
│   ├── admin/         # Admin module screens
│   ├── engineer/      # Engineer module screens
│   ├── viewer/        # Viewer module screens
│   └── shared/        # Shared screens
├── services/          # API services
├── store/             # State management
├── types/             # TypeScript types
└── utils/             # Utility functions
```

## User Roles

- **Admin**: Full system access, user management, configuration
- **Engineer**: Data capture, condition assessment, traffic counts
- **Viewer**: Read-only access, reports, dashboards
- **Analyst**: Report generation, data analysis

## Demo Credentials

- Username: `admin` / `engineer` / `viewer`
- Password: any

## Key Screens

1. **Dashboard**: Metrics, trends, quick actions
2. **GIS Map Viewer**: Interactive map with layers and filters
3. **Road Inventory**: Sortable table with CRUD operations
4. **Condition Capture**: Multi-step form with photo/GPS
5. **Traffic Count**: Vehicle counting form
6. **Reports**: Configurable report generation
7. **User Management**: User CRUD with role assignment
8. **Announcements**: System-wide notifications

## Responsive Design

The system is fully responsive and works on:
- Desktop (1920x1080+)
- Tablet (768x1024)
- Mobile (375x667+)

## Offline Capability

Engineers can capture data offline. The system will:
- Store data locally
- Show sync status indicator
- Auto-sync when connection restored

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

Proprietary - All rights reserved
