# The Human Machine - Interactive Anatomy Explorer

An innovative, gamified anatomy learning platform that transforms traditional encyclopedic anatomy into an explorable, interactive experience. Unlike static text-based resources, this platform emphasizes the biomechanics of the human body—teaching how parts connect and move like levers, pulleys, and electrical systems.

## Unique Selling Proposition

**"The Mechanic's View"** - Instead of just memorizing names, users understand:
- How bones act as lever systems
- How muscles function as pulleys and motors
- How nerves work as electrical wiring
- How everything connects and moves together

## Core Features

### 1. Layered Reality Visualization
- Smooth layer transitions controlled by an intuitive vertical slider
- Seamless peeling effect: Skin → Muscular → Nervous → Skeletal
- Deeper layers remain partially visible for context

### 2. Interactive Connections
- Hover over any part to see what it connects to
- Visual highlighting of relationships (origin, insertion, innervation)
- Click for detailed biomechanical explanations

### 3. Gamified Learning Progression
- Start with the Skeletal System (unlocked by default)
- Pass interactive quizzes to unlock new layers
- Track exploration progress and learning achievements

### 4. Educational Excellence
- Biomechanical explanations for every structure
- "Fun Facts" to make learning memorable
- Credible references and sources for all information
- Persistent medical disclaimer for safety

## Technology Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Database**: Supabase (PostgreSQL)
- **Visualization**: Interactive SVGs (Three.js planned for Phase 2)
- **Icons**: Lucide React

## Project Structure

```
src/
├── components/
│   ├── anatomy/           # Core visualization components
│   │   ├── AnatomyViewer.tsx
│   │   ├── InteractiveSVG.tsx
│   │   └── LayerSlider.tsx
│   ├── panels/            # Information panels
│   │   ├── DetailPanel.tsx
│   │   ├── MedicalDisclaimer.tsx
│   │   └── SourcesToggle.tsx
│   └── gamification/      # Quiz and progress components
│       └── QuizModal.tsx
├── contexts/              # Global state management
│   ├── AnatomyContext.tsx
│   ├── LayerContext.tsx
│   └── ProgressContext.tsx
├── types/                 # TypeScript definitions
│   ├── anatomy.ts
│   ├── quiz.ts
│   └── user.ts
├── utils/                 # Helper functions
│   └── constants.ts
└── lib/
    └── supabase.ts       # Database client
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Supabase account (free tier is sufficient)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd human-anatomy-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Create database tables**

   Run the migration scripts in `DATABASE_SCHEMA.md` in your Supabase SQL editor:
   - Create tables: `bones`, `muscles`, `nerves`, `systems`, `user_progress`, `quiz_questions`
   - Set up Row Level Security policies
   - Populate with sample data from `SAMPLE_DATA.json`

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

### Database Setup Guide

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy the table creation SQL from `DATABASE_SCHEMA.md`
4. Run the SQL to create tables
5. Enable RLS for all tables
6. Insert sample data from `SAMPLE_DATA.json`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

### Adding New Anatomy Content

1. **Add data to Supabase**
   ```sql
   INSERT INTO bones (name, common_name, description, biomechanical_function, svg_path_id, ...)
   VALUES ('Radius', 'Forearm Bone', '...', '...', 'bone_radius_left', ...);
   ```

2. **Update SVG file**
   - Add a group element with `data-part-id` matching the database `svg_path_id`
   ```html
   <g data-part-id="bone_radius_left">
     <rect ... />
   </g>
   ```

3. **Test interactions**
   - Hover should highlight the part
   - Click should open detail panel
   - Connections should highlight related parts

### Creating Quiz Questions

Add questions to the `quiz_questions` table:
```sql
INSERT INTO quiz_questions (system_name, question_type, question_text, correct_answer_id, options, difficulty, explanation)
VALUES (
  'Skeletal System',
  'click_to_identify',
  'Click on the Radius bone',
  'bone_radius_left',
  NULL,
  1,
  'The radius is the lateral bone of the forearm...'
);
```

## Architecture Highlights

### Layer Slider Mechanism

The slider controls layer opacity using a calculated algorithm:

```
Slider: 0-33    → Skeletal visible, Nervous fades in
Slider: 33-66   → Skeletal + Nervous visible, Muscular fades in
Slider: 66-100  → All layers visible, Skin fades in
```

### Connection Highlighting

When a part is hovered:
1. System finds related parts from database relationships
2. Related parts are highlighted in a different color
3. Visual representation of how parts work together

### Progress Tracking

User progress is stored both in:
- **LocalStorage**: For immediate persistence
- **Supabase**: For cross-device sync (if auth is implemented)

## Deployment

### Build for Production

```bash
npm run build
```

The `dist` folder will contain the optimized production build.

### Environment Variables

Ensure these are set in your hosting environment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

### Recommended Hosting

- **Vercel**: Automatic deployment from Git
- **Netlify**: Zero-config deployment
- **Cloudflare Pages**: Fast global CDN

## Roadmap

### Phase 1: MVP (Current)
- ✅ Interactive SVG layer visualization
- ✅ Hover interactions with connection highlighting
- ✅ Detail panels with biomechanical explanations
- ✅ Quiz system for gamified progression
- ✅ Supabase integration

### Phase 2: Enhanced Interactivity
- [ ] Three.js 3D models
- [ ] Animated muscle contractions
- [ ] Multiple viewing angles
- [ ] Touch/gesture support for mobile

### Phase 3: Advanced Features
- [ ] User accounts and authentication
- [ ] Custom quiz creation (for educators)
- [ ] Pathology overlays (injuries, diseases)
- [ ] AR mode (view anatomy in real space)
- [ ] Multi-language support

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Focus on accuracy - all anatomy content should be cited
2. Maintain the "Human Machine" theme - explain biomechanics
3. Follow the existing code style (TypeScript, functional components)
4. Add tests for new features
5. Update documentation

## Medical Disclaimer

This interactive anatomy tool is designed for educational purposes only and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

## License

MIT License - See LICENSE file for details

## Credits

- Anatomy data and references from Gray's Anatomy and NCBI publications
- Icons by Lucide React
- Built with React, TypeScript, and Supabase

## Support

For questions, issues, or feature requests:
- Open an issue on GitHub
- Check the `ARCHITECTURE.md` for technical details
- Review `DATABASE_SCHEMA.md` for data model documentation

---

**Built with ❤️ for anatomy enthusiasts and learners everywhere.**
