# Database Schema for Human Anatomy Website

## Tables Structure

### 1. bones
```sql
- id: uuid (primary key)
- name: text (e.g., "Femur")
- common_name: text (e.g., "Thigh Bone")
- description: text
- biomechanical_function: text (e.g., "Acts as a lever for the quadriceps muscle group")
- svg_path_id: text (matches SVG element ID)
- articulates_with: text[] (array of bone IDs it connects to)
- position_data: jsonb (x, y coordinates for labeling)
- fun_fact: text
- reference_sources: text[]
- created_at: timestamptz
```

### 2. muscles
```sql
- id: uuid (primary key)
- name: text (e.g., "Biceps Brachii")
- common_name: text (e.g., "Bicep")
- description: text
- biomechanical_function: text (e.g., "Pulls the forearm upward like a pulley system")
- svg_path_id: text
- origin_bone_id: uuid (FK to bones) - where it attaches from
- insertion_bone_id: uuid (FK to bones) - where it attaches to
- nerve_supply_id: uuid (FK to nerves)
- muscle_group: text (e.g., "Upper Arm Flexors")
- action: text (e.g., "Elbow flexion, forearm supination")
- position_data: jsonb
- fun_fact: text
- reference_sources: text[]
- created_at: timestamptz
```

### 3. nerves
```sql
- id: uuid (primary key)
- name: text (e.g., "Musculocutaneous Nerve")
- description: text
- biomechanical_function: text (e.g., "Carries electrical signals like wiring to activate biceps")
- svg_path_id: text
- origin_point: text (e.g., "C5-C7 spinal nerves")
- innervates: uuid[] (array of muscle IDs)
- position_data: jsonb
- reference_sources: text[]
- created_at: timestamptz
```

### 4. systems
```sql
- id: uuid (primary key)
- name: text (e.g., "Skeletal System", "Muscular System")
- layer_order: integer (1 = deepest, 3 = skin)
- unlock_requirement: text (null for skeletal, "skeletal_quiz_passed" for muscular)
- color_theme: text (hex color for UI)
- description: text
```

### 5. user_progress
```sql
- id: uuid (primary key)
- user_id: uuid (FK to auth.users) - if using auth, otherwise session-based
- unlocked_systems: text[] (array of system names)
- quiz_scores: jsonb ({"skeletal": 8, "muscular": 7})
- parts_viewed: text[] (tracking exploration)
- last_active_layer: text
- created_at: timestamptz
- updated_at: timestamptz
```

### 6. quiz_questions
```sql
- id: uuid (primary key)
- system_name: text (e.g., "Skeletal System")
- question_type: text ("click_to_identify", "multiple_choice", "connection_match")
- question_text: text (e.g., "Click on the Femur")
- correct_answer_id: text (svg_path_id or option)
- options: jsonb (for multiple choice)
- difficulty: integer (1-3)
- explanation: text (shown after answering)
```

### 7. connections
```sql
- id: uuid (primary key)
- from_type: text ("bone", "muscle", "nerve")
- from_id: uuid
- to_type: text
- to_id: uuid
- relationship_type: text ("origin", "insertion", "articulation", "innervation")
- description: text
```

## Relationships

```
muscles.origin_bone_id → bones.id
muscles.insertion_bone_id → bones.id
muscles.nerve_supply_id → nerves.id
nerves.innervates[] → muscles.id[]
user_progress.user_id → auth.users.id
quiz_questions.correct_answer_id → bones/muscles/nerves.svg_path_id
```

## Sample JSON Structure (for understanding)

While we'll use Supabase, here's how a muscle would look with relationships:

```json
{
  "id": "muscle_001",
  "name": "Biceps Brachii",
  "common_name": "Bicep",
  "biomechanical_function": "Functions as a third-class lever system, pulling the radius bone upward. The elbow joint is the fulcrum, the muscle provides effort, and the hand/weight is the load.",
  "origin_bone_id": "bone_scapula",
  "insertion_bone_id": "bone_radius",
  "nerve_supply_id": "nerve_musculocutaneous",
  "action": "Flexes elbow, supinates forearm (turns palm up)",
  "svg_path_id": "biceps-brachii-left",
  "connections": {
    "pulls_on": ["bone_radius"],
    "anchored_to": ["bone_scapula"],
    "powered_by": ["nerve_musculocutaneous"]
  }
}
```
