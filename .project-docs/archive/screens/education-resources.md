# Education & Resources

**Parent Navigation:** Account

## Screen Overview

Patients browse curated educational content about nutrition, diabetes management, behavioral health, and healthy habits. They can read articles, watch videos, bookmark favorites, and get personalized recommendations from Ava based on their care plan and goals.

## Features on Screen

- **Recommended for You** - Personalized content based on patient's conditions, care plan goals, and recent activities. Shows 3-5 top picks.
- **Content Categories** - Browse by topic: Nutrition Basics, Meal Planning, Blood Sugar Management, Behavioral Health, Recipes, Exercise, Medications, etc.
- **Search Bar** - Search all content by keyword or topic.
- **Content Cards** - Each shows title, type (article/video/guide), read time or duration, thumbnail, bookmark icon. Click to open.
- **Bookmarks** - Saved content accessible via dedicated tab or filter. Shows all bookmarked articles and videos.
- **Recently Viewed** - Last 5-10 pieces of content accessed for easy return.

**Key data:** contentTitle, contentType, thumbnailUrl, readTime, category, isBookmarked, viewedDate

## Ava Integration

**New user:** "Welcome! I've picked some great articles to help you get started with your nutrition plan. Want to check them out?"

**Goal-related:** "I noticed your goal is to reduce A1C. Here are 3 articles about blood sugar management that might help."

**After appointment:** "Dr. Chen mentioned the Mediterranean diet in your appointment. I found a beginner's guide and some recipes for you."

## Wireframe

```
┌──────────────────────────────────────┬─────────────────┐
│ Education & Resources  [🔍 Search]   │ Ava Chat        │
├──────────────────────────────────────┤                 │
│ [Recommended] [All] [Bookmarks]      │ "I noticed your │
│                                      │ goal is to      │
│ RECOMMENDED FOR YOU                  │ reduce A1C..."  │
│ ┌──────────────────────────────────┐ │                 │
│ │ [📄 Thumbnail]                   │ │ [Chat input]    │
│ │ Blood Sugar Basics               │ │                 │
│ │ Article • 5 min read  [★ CLICK]  │ │                 │
│ │ [CLICK TO READ]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ [🎥 Thumbnail]                   │ │                 │
│ │ Carb Counting Made Easy          │ │                 │
│ │ Video • 8 min  [☆ CLICK]         │ │ [Audit log]     │
│ │ [CLICK TO WATCH]                 │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ BROWSE BY TOPIC                      │                 │
│ [Nutrition] [Blood Sugar] [Recipes]  │                 │
│ [Exercise] [Mental Health] [More]    │                 │
│                                      │                 │
│ ALL CONTENT                          │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ Mediterranean Diet Guide         │ │                 │
│ │ Guide • 12 min  [★ Bookmarked]   │ │                 │
│ │ [CLICK TO READ]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
│                                      │                 │
│ ┌──────────────────────────────────┐ │                 │
│ │ 5 Easy Low-Carb Recipes          │ │                 │
│ │ Article • 7 min  [☆]             │ │                 │
│ │ [CLICK TO READ]                  │ │                 │
│ └──────────────────────────────────┘ │                 │
└──────────────────────────────────────┴─────────────────┘
```

## Critical Questions

- **Content source:** All curated by Cena staff or include external links? → **A) Curated library only for v1 (quality control)**
- **Personalization:** Manual curation or AI-based on patient data? → **A) Ava suggests based on care plan + goals + recent activity**
- **Tracking:** Log what patients view/complete? → **A) Yes, track views for recommendations + show "recently viewed"**