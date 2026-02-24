# Sumita News Bhojpuri

## Current State

This is a new project with no existing implementation. The workspace contains only the default Caffeine project structure.

## Requested Changes (Diff)

### Add

- **Backend News Management System**
  - News article storage with fields: id, title, content, excerpt, image, category, publishDate, authorId
  - Categories: भोजपुरी सिनेमा (Bhojpuri Cinema), वायरल खबर (Viral News), राजनीति (Politics), इंटरव्यू (Interview)
  - CRUD operations for news articles (admin only)
  - Public API to fetch all news articles
  - Public API to fetch single article by ID
  - Public API to filter articles by category

- **Frontend Homepage**
  - Grid layout displaying all published news articles
  - Each news card shows: image, title, date, category
  - Responsive mobile-friendly design
  - Hindi typography and proper font rendering
  - Category filter/navigation
  - Click on card navigates to article detail page

- **Frontend Article Detail Page**
  - Dynamic routing using article ID (/article/[id])
  - Fetch and display full article content
  - Show article image, title, date, category, and full content
  - Back navigation to homepage
  - Hindi text rendering throughout

- **Frontend Admin Panel**
  - Protected admin route with authorization
  - Form to create new articles with fields: title, content, excerpt, category, image upload
  - List view of all articles with edit/delete actions
  - Form to edit existing articles
  - Image upload via blob storage

- **Authorization System**
  - Admin role for content management
  - Login/logout functionality
  - Protected admin routes

- **Blob Storage**
  - Image upload for news articles
  - Image retrieval for display

### Modify

None (new project)

### Remove

None (new project)

## Implementation Plan

1. **Select Caffeine Components**
   - Authorization: for admin access control
   - Blob Storage: for news article images

2. **Backend Development**
   - Generate Motoko backend with:
     - News article data structure with Hindi text support
     - Four categories: भोजपुरी सिनेमा, वायरल खबर, राजनीति, इंटरव्यू
     - Admin-only create/update/delete operations
     - Public read operations (all articles, single article, filter by category)
     - Integration with authorization and blob storage components

3. **Frontend Development**
   - Homepage component:
     - Fetch and display all news articles
     - Responsive grid layout
     - News cards with image, title, date, category
     - Category filter navigation
     - Click handler to navigate to article detail
   
   - Article Detail page:
     - Dynamic route setup (/article/[id])
     - Fetch article by ID from backend
     - Display full article content with proper Hindi rendering
     - Handle loading and error states
   
   - Admin Panel:
     - Login page with authorization
     - Dashboard showing all articles
     - Create article form with image upload
     - Edit article form
     - Delete functionality
   
   - Styling:
     - Hindi font integration (Noto Sans Devanagari or similar)
     - Mobile-first responsive design
     - Clean, modern news website aesthetic
     - Proper text direction and spacing for Hindi

4. **Validation & Deployment**
   - Type checking
   - Build verification
   - Deploy preview

## UX Notes

- The website will be entirely in Hindi, providing an authentic experience for Hindi-speaking users interested in Bhojpuri culture and news
- News cards on homepage provide quick scanning with image, title, and date
- Category-based navigation helps users find content of interest
- Article detail page provides immersive reading experience with full content
- Admin panel is intuitive with clear forms for content management
- Image uploads enhance visual appeal and engagement
- Mobile-friendly design ensures accessibility across devices
- Dynamic routing ensures proper URL structure and shareability (/article/[id])
