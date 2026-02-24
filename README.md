# सुमिता न्यूज़ भोजपुरी (Sumita News Bhojpuri)

A modern Hindi news website for Bhojpuri culture, built on the Internet Computer.

## Features

### Public Features
- **Homepage**: Browse all news articles with category filtering
- **Article Detail**: Read full articles with images and formatted content
- **Category Navigation**: Filter by भोजपुरी सिनेमा, वायरल खबर, राजनीति, or इंटरव्यू
- **Responsive Design**: Optimized for mobile and desktop
- **Dark/Light Theme**: Toggle between themes
- **Hindi Typography**: Beautiful Devanagari fonts (Tiro Devanagari Hindi + Noto Sans Devanagari)

### Admin Features
- **Protected Admin Panel**: Login via Internet Identity
- **Create Articles**: Add new news articles with images
- **Edit Articles**: Update existing articles
- **Delete Articles**: Remove articles with confirmation
- **Image Upload**: Upload article images with progress tracking
- **Category Management**: Assign articles to specific categories

## Design

### Color Palette
- **Primary**: Warm terracotta (#E07A5F approx) - trustworthy, earthy
- **Accent**: Amber (#F4A261 approx) - warm highlights
- **Background**: Cream (#FAF7F4) light mode, Deep charcoal (#2B2725) dark mode
- **Category Colors**: Unique colors for each category (purple for cinema, green for viral, blue for politics, teal for interviews)

### Typography
- **Display**: Tiro Devanagari Hindi (elegant serif for headlines)
- **Body**: Noto Sans Devanagari (clean, readable sans-serif)

### Signature Detail
- Left-edge colored accent bars on news cards based on category
- Category-specific color coding throughout the interface
- Newspaper-inspired layout with modern spacing

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Routing**: TanStack Router with dynamic routes
- **Styling**: Tailwind CSS + OKLCH color system
- **UI Components**: shadcn/ui (Radix primitives)
- **State Management**: React Query (TanStack Query)
- **Backend**: Motoko canister on Internet Computer
- **Authentication**: Internet Identity
- **File Storage**: ExternalBlob for images

## Project Structure

```
src/frontend/src/
├── components/
│   ├── Header.tsx          # Main navigation header
│   ├── Footer.tsx          # Site footer
│   ├── CategoryFilter.tsx  # Category selection tabs
│   └── NewsCard.tsx        # Article card component
├── pages/
│   ├── HomePage.tsx           # Main news listing
│   ├── ArticleDetailPage.tsx # Full article view
│   ├── AdminLoginPage.tsx    # Admin authentication
│   ├── AdminDashboard.tsx    # Article management
│   └── AdminArticleForm.tsx  # Create/edit form
├── hooks/
│   └── useQueries.ts       # React Query hooks for backend
├── utils/
│   ├── categories.ts       # Category labels and colors
│   └── dateFormat.ts       # Date formatting utilities
└── App.tsx                 # Router setup
```

## Routes

- `/` - Homepage with all articles
- `/article/:id` - Individual article detail page
- `/admin/login` - Admin login page
- `/admin` - Admin dashboard (protected)
- `/admin/create` - Create new article (protected)
- `/admin/edit/:id` - Edit existing article (protected)

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm --filter '@caffeine/template-frontend' start

# Type checking
pnpm --filter '@caffeine/template-frontend' typescript-check

# Lint
pnpm --filter '@caffeine/template-frontend' lint

# Build
pnpm --filter '@caffeine/template-frontend' build:skip-bindings
```

## Backend API

The backend Motoko canister provides these methods:

- `getAllArticles(page, pageSize)` - Get paginated articles
- `getArticleById(id)` - Get single article
- `getArticlesByCategory(category)` - Filter by category
- `getCategoriesInHindi()` - Get category list with Hindi labels
- `createArticle(...)` - Create new article (admin only)
- `updateArticle(...)` - Update article (admin only)
- `deleteArticle(id)` - Delete article (admin only)
- `isCallerAdmin()` - Check admin status

## Categories

1. **भोजपुरी सिनेमा** (cinema) - Bhojpuri cinema news
2. **वायरल खबर** (viralNews) - Viral news
3. **राजनीति** (politics) - Political news
4. **इंटरव्यू** (interview) - Interviews

## License

Built with ♥ using [caffeine.ai](https://caffeine.ai)
