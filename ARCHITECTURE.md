# Human Anatomy Website - Architecture Documentation

## Overview

This is an interactive, gamified anatomy learning platform focused on the "Human Machine" biomechanics concept. Users explore the human body through layered visualization with a slider that reveals different anatomical systems.

## Core Architectural Principles

### 1. The Layered Reality System

The heart of the application is the layer visualization system, controlled by a single slider:

#### How It Works:

```
Slider Value: 0 -------> 33 -------> 66 -------> 100
Layer View:   Skeletal    Nervous     Muscular    Skin
```

**Technical Implementation:**

The `LayerContext` manages a `sliderValue` (0-100) and calculates opacity for each layer:

```typescript
0-33:   Skeletal = 1.0,  Nervous = 0 → 1.0
33-66:  Skeletal = 1.0 → 0.7,  Nervous = 1.0,  Muscular = 0 → 1.0
66-100: Skeletal = 0.7 → 0,  Nervous = 1.0 → 0.5,  Muscular = 1.0,  Skin = 0 → 1.0
```

**Key Design Decision:** Deeper layers (skeletal) remain partially visible even when outer layers are shown, creating a true "layered reality" effect rather than a simple toggle.

### 2. State Management Architecture

#### Context Hierarchy:
```
<ProgressProvider>          # User progress & unlocked systems
  <AnatomyProvider>         # Anatomy data & interactions
    <LayerProvider>         # Layer visibility state
      <App>
        <AnatomyViewer>
```

Each context has a specific responsibility:

- **LayerContext**: Controls the slider and calculates layer opacity
- **AnatomyContext**: Fetches and manages anatomy data from Supabase, handles hover/click interactions
- **ProgressContext**: Tracks user progress, unlocked systems, quiz scores

### 3. Component Architecture

#### Main Components:

**AnatomyViewer** (Container)
├── **InteractiveSVG** (x4 - one per layer)
│   └── Handles hover/click events, applies highlighting
├── **LayerSlider**
│   └── Controls layer visibility via slider
├── **DetailPanel**
│   └── Shows clicked part information + connections
└── **MedicalDisclaimer**

#### Interaction Flow:

```
User moves slider
    ↓
LayerSlider updates sliderValue in LayerContext
    ↓
LayerContext recalculates opacity for each layer
    ↓
InteractiveSVG components re-render with new opacity
    ↓
User sees smooth layer transition
```

#### Hover Interaction Flow:

```
User hovers over SVG element with data-part-id
    ↓
InteractiveSVG calls setHoveredPart(partId)
    ↓
AnatomyContext finds connections (origin, insertion, innervation)
    ↓
Connected parts highlighted in different color
    ↓
User sees "mechanic's view" of how parts connect
```

### 4. Data Model & Relationships

#### Database Tables:

**bones** ← (articulates_with) → **bones**
**muscles** → (origin_bone_id) → **bones**
**muscles** → (insertion_bone_id) → **bones**
**muscles** → (nerve_supply_id) → **nerves**
**nerves** → (innervates[]) → **muscles**

#### Example: When user hovers over Biceps muscle:
1. System finds `origin_bone_id` (Scapula) and highlights it
2. System finds `insertion_bone_id` (Radius) and highlights it
3. System finds `nerve_supply_id` (Musculocutaneous) and highlights it
4. User sees the complete mechanical system

### 5. Gamification System

#### Unlock Progression:
```
Start: Skeletal System (unlocked by default)
    ↓
Pass Skeletal Quiz (70% required)
    ↓
Unlock: Muscular System
    ↓
Pass Muscular Quiz
    ↓
Unlock: Nervous System
```

**Implementation:**
- `ProgressContext` tracks `unlocked_systems[]`
- `LayerSlider` checks if layer is unlocked before allowing access
- `QuizModal` updates progress and unlocks next system on pass

### 6. SVG Interaction System

Each SVG element must have a `data-part-id` attribute:

```html
<g data-part-id="bone_femur_left">
  <rect x="330" y="600" width="35" height="250" fill="#E8E8E8"/>
</g>
```

The `InteractiveSVG` component:
1. Uses `dangerouslySetInnerHTML` to render SVG
2. Queries all `[data-part-id]` elements
3. Attaches event listeners (mouseenter, mouseleave, click)
4. Dynamically applies styles for hover/connection highlighting

**Security Note:** SVG content should be sanitized before rendering if user-generated.

## Key Technical Decisions

### Why Supabase Over Local JSON?
- **User Progress Persistence**: Track progress across sessions/devices
- **Scalability**: Easy to add more content without rebuilding
- **Real-time Updates**: Can push content updates without redeploying
- **Analytics**: Track which parts users explore most

### Why Context API Over Redux?
- Simpler for this use case (3 contexts vs. complex Redux setup)
- Better tree-shaking (only load what you use)
- Built-in React patterns (no additional dependencies)

### Why SVG Over Canvas/WebGL?
- **MVP Speed**: Faster to implement interactive SVGs
- **Accessibility**: SVG elements can have semantic meaning
- **Styling**: Easy to apply CSS for highlighting
- **Path Forward**: Can migrate to Three.js later without changing data model

## Performance Considerations

### Optimization Strategies:
1. **Lazy Loading**: Only fetch layer data when unlocked
2. **Memoization**: Use `useMemo` for connection calculations
3. **Event Delegation**: Single listener per SVG (not per element)
4. **Opacity Transitions**: CSS transitions (GPU-accelerated)

### Potential Bottlenecks:
- Large SVG files (solution: optimize/compress SVGs)
- Many simultaneous connections (solution: limit to top 5)
- Database queries on every hover (solution: cache anatomy data in context)

## Migration Path to Three.js

When ready to upgrade from SVG to 3D:

1. **Data Model** (no changes needed): Same bone/muscle/nerve relationships
2. **InteractiveSVG** → **Interactive3DModel**: Replace component
3. **LayerContext**: Same opacity calculation, apply to Three.js materials
4. **Hover/Click**: Raycasting instead of DOM events

## Development Workflow

### Adding New Anatomy Parts:

1. Add entry to Supabase table (`bones`, `muscles`, or `nerves`)
2. Include relationships (`origin_bone_id`, `insertion_bone_id`, etc.)
3. Add SVG element with matching `data-part-id`
4. Test hover interactions and detail panel
5. Add quiz questions for the part

### Adding New System Layer:

1. Add to `systems` table with unlock requirement
2. Update `LAYER_ORDER` in `constants.ts`
3. Create new SVG file for the layer
4. Add to `layerVisibility` calculation in `LayerContext`
5. Create quiz content for unlock progression

## Security & Data Safety

### Row Level Security (RLS):
```sql
-- Users can only access their own progress
CREATE POLICY "Users view own progress"
  ON user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### Input Validation:
- All quiz answers validated server-side
- Part IDs sanitized before database queries
- SVG content from database should be trusted (not user-generated)

## Testing Strategy

### Unit Tests:
- `calculateLayerVisibility()` function
- Connection finding logic
- Quiz scoring algorithm

### Integration Tests:
- Hover → highlight flow
- Quiz completion → unlock flow
- Progress persistence across sessions

### E2E Tests:
- Full user journey: explore → quiz → unlock → explore
- Slider interaction and layer transitions
- Cross-browser compatibility (especially SVG rendering)

## Deployment Considerations

### Environment Variables:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

### Build Optimization:
- Tree-shake unused Lucide icons
- Optimize SVG files (SVGO)
- Code-split by route if adding pages

### Monitoring:
- Track quiz pass rates (identify difficult content)
- Monitor hover patterns (optimize popular parts)
- Track unlock progression (identify drop-off points)

## Future Enhancements

### Phase 2 (Post-MVP):
1. Three.js 3D models
2. Animation system (show muscle contraction)
3. Pathology overlays (show injuries/diseases)
4. Comparison mode (compare two systems side-by-side)

### Phase 3 (Advanced):
1. AR mode (view anatomy in real space)
2. Custom quiz creation (educators)
3. Social features (share discoveries)
4. Multi-language support

## Conclusion

This architecture balances immediate development speed (SVG, Context API) with future scalability (Supabase, component modularity). The layer system is the core innovation, providing a unique learning experience compared to traditional anatomy resources.
