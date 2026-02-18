# RRAMS Feature Access Matrix

## Custom Map & Report Creation Features

### Location
`src/modules/shared/MapViewer.tsx`

### Available to All Roles
✅ **Admin** - Full access
✅ **Engineer** - Full access  
✅ **Viewer** - Full access (Read-only role but can create custom views)

### Features

#### 1. Create Custom Map
- **Button**: "Create Custom Map" (Blue button at top of map sidebar)
- **Capabilities**:
  - Filter roads by VCI threshold (e.g., "Show all roads with VCI lower than 50")
  - Filter by surface type (Paved, Unpaved, Gravel)
  - Save custom map with a name
  - Real-time map filtering

#### 2. Create Custom Report
- **Button**: "Create Custom Report" (Green button at top of map sidebar)
- **Capabilities**:
  - Choose format: Chart or Tabular
  - Filter by pothole extent threshold (e.g., "Show roads where pothole extent is above 30%")
  - Filter by municipality
  - Share report with other users

### User Access Verification

From `src/components/layout/Layout.tsx`:
```typescript
{ name: 'Map', path: '/map', icon: Map, roles: ['admin', 'engineer', 'viewer'] }
```

All three roles have access to the Map screen, which includes:
- Interactive Leaflet map
- Layer controls
- Filter panel
- **Custom map creation** ✅
- **Custom report creation** ✅

### Navigation Path
1. Login as any role (admin/engineer/viewer)
2. Click "Map" in left sidebar
3. See "Create Custom Map" and "Create Custom Report" buttons at top of sidebar
4. Click to open modal and configure custom view
5. Save/Share to create custom map or report

## Implementation Status
✅ Custom map creation - COMPLETE
✅ Custom report creation - COMPLETE
✅ Available to viewers - CONFIRMED
✅ VCI threshold filtering - IMPLEMENTED
✅ Pothole threshold filtering - IMPLEMENTED
✅ Share functionality - IMPLEMENTED
