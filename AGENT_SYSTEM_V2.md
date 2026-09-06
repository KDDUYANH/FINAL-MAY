# MÂY IMAGE STUDIO — AUTONOMOUS BUILDER SYSTEM

## 0. Mission

Build **MÂY Image Studio v1**, a focused AI product-image editing application for small cosmetic brands.

The product must make this workflow extremely simple:

**UPLOAD → ENHANCE → PROTECT → EXPORT**

The six reference images in `/reference-images` are **visual references only**. Synthesize their strongest design ideas; do not copy any screen literally.

The application should feel like a premium, calm, Soft Luxury image editor—not an enterprise DAM, campaign manager, or generic AI dashboard.

---

# 1. NON-NEGOTIABLE PRODUCT PRINCIPLES

## 1.1 Product Integrity

Product packaging is the source of truth.

AI generation must never be allowed to freely rewrite:
- product geometry
- bottle/jar/tube shape
- cap/pump/dropper
- printed label
- label typography
- formulation text
- logos printed on the physical product
- fluid/product color

For active formulations such as **25% Mandelic Acid**, label text must remain visually faithful to the source.

Do NOT claim that a negative prompt alone guarantees integrity.

Use a protected compositing architecture:

```text
ORIGINAL IMAGE
     |
     +--> PRODUCT / LABEL SEGMENTATION
     |        |
     |        +--> LOCKED PRODUCT REGION
     |
     +--> EDITABLE BACKGROUND REGION
                |
                +--> AI GENERATION
                         |
                         v
                  COMPOSITE WITH
                  ORIGINAL PRODUCT
                         |
                         v
                  INTEGRITY CHECK
```

The safest default is:
**AI modifies background/environment only; original product pixels are preserved whenever possible.**

## 1.2 Non-destructive editing

Never mutate the uploaded master asset.

Maintain:
- original asset
- generated/edited derivative
- compositing instructions
- watermark configuration
- export configuration

Before/After, watermark and preview layers should be computed client-side where practical using Canvas/Web APIs.

## 1.3 Simple by default

The user should not have to understand:
- segmentation
- masks
- AI models
- prompts
- campaign management
- creative strategy
- content analysis
- asset taxonomy

Expose simple controls first. Put technical controls under Advanced.

---

# 2. USER WORKFLOW

Visible workflow:

```text
01 UPLOAD
02 ENHANCE
03 PROTECT
04 EXPORT
```

Internal pipeline:

```text
Upload
  ↓
Auto Product Analysis
  ↓
Product / Label Protection
  ↓
AI Enhancement
  ↓
Background Generation
  ↓
Composite
  ↓
Integrity QA
  ↓
Smart Watermark
  ↓
Batch Adaptation
  ↓
Export
```

Do not create a visible 7–10 step workflow.

---

# 3. MVP SCOPE

## MUST BUILD

### Upload
- drag and drop
- file picker
- multi-image upload
- thumbnails
- active asset selection
- processing status

### Canvas
- large central canvas
- Before / After split slider
- mouse + touch interaction
- smooth dragging
- 200% inspection loupe
- fit-to-screen
- zoom controls

### AI Enhance
- Auto Enhance
- preset-based enhancement
- background presets
- lighting presets
- optional advanced controls

Initial presets:

```text
Enhance:
- Clean Luxury
- Soft Pink
- Marble Studio
- Editorial
- Natural

Background:
- Original
- Clean Studio
- Soft Silk
- Marble
- Floral

Lighting:
- Natural
- Soft Luxury
- Warm Studio
```

### Product Protection
- product detection state
- label protection state
- smart placement
- protected region visualization in Advanced mode

### Watermark
Initial presets:

```text
- MÂY Logo
- Security Grid
- Diagonal Security
```

Controls:
- ON/OFF
- opacity
- scale
- rotation
- spacing
- smart placement

Watermark must avoid:
- product
- label
- important text
- focal point where possible

### Batch
- bottom filmstrip
- multi-select
- master settings
- Apply Master to All
- per-image status

Important:
**Do not blindly copy pixel coordinates between different aspect ratios.**
Normalize placement and adapt it per image.

### Export
Formats:
- JPG
- PNG
- WebP

Ratios:
- Original
- 1:1
- 4:5
- 9:16
- 16:9

Resolutions:
- Original
- 2K
- 4K

Include watermark/protection in final export according to user settings.

---

# 4. EXPLICITLY OUT OF MVP

Do NOT build these as major workflows:

- AI Creative Director
- AI Content Insight
- Campaign management
- Content calendar
- Social media management
- Article/caption editor
- Audience analysis dashboard
- Brand System dashboard
- complex Poster Studio
- complex Content Studio
- enterprise approval workflow
- large asset-management dashboard
- dozens of watermark presets
- complex creative strategy controls

Poster Studio and Content Studio may be future modules, but Image Studio must stand alone first.

---

# 5. UX / LAYOUT

Use a three-zone desktop layout:

```text
┌─────────────────────────────────────────────────────────────┐
│ MÂY                 IMAGE STUDIO                    EXPORT  │
├────────────┬───────────────────────────────┬───────────────┤
│            │                               │               │
│ TOOLS      │                               │ INSPECTOR     │
│            │        BEFORE | AFTER         │               │
│ + Upload   │                               │ Enhance       │
│            │          PRODUCT              │ Background    │
│ Enhance    │                               │ Lighting      │
│ Background │                               │ Protection    │
│ Lighting   │                               │               │
│ Protect    │                               │               │
│            │                               │ [Apply]       │
├────────────┴───────────────────────────────┴───────────────┤
│ 01  02  03  04  05  06 ...                  Apply All     │
└─────────────────────────────────────────────────────────────┘
```

Desktop:
- left sidebar: ~220–250px
- central canvas: dominant area
- right inspector: ~300–360px
- bottom filmstrip: compact

The canvas must receive the strongest visual hierarchy.

Mobile/tablet:
- collapse left sidebar into a drawer
- inspector becomes bottom sheet/drawer
- keep canvas and essential controls usable
- preserve touch slider behavior

---

# 6. VISUAL DESIGN SYSTEM

Reference direction:
**Soft Luxury / premium cosmetic studio**

Tokens:

```text
Rose Gold:       #B76E79
Blush Silk:      #FADCD9
Soft Surface:    #FDF7F7
Warm Champagne:  #FFF5EB
Dark Text:       #2D1D1F
Muted Text:      #7D6B6E
```

Typography:
- display: Cinzel or Playfair Display
- UI: Plus Jakarta Sans or Inter

Visual characteristics:
- warm off-white surfaces
- subtle rose/champagne accents
- restrained borders
- generous spacing
- soft radius
- minimal shadows
- premium editorial composition
- no excessive gradients
- no neon AI aesthetic
- no dark enterprise dashboard for the default Image Studio

Do not blindly reproduce the references. Extract:
- hierarchy
- spacing
- canvas dominance
- premium palette
- card language
- filmstrip behavior
- watermark visualization
- Before/After interaction

---

# 7. TECH STACK

Preferred:

- Next.js 15+
- App Router
- React 19
- TypeScript strict
- Tailwind CSS
- Zustand
- Lucide React

Use a modular architecture.

Suggested structure:

```text
app/
  page.tsx
  studio/
    page.tsx
  api/
    ai/
      analyze/
      segment/
      enhance/
      background/
    export/

components/
  studio/
    StudioShell.tsx
    ToolSidebar.tsx
    InspectorPanel.tsx
    StudioCanvas.tsx
    BeforeAfterSlider.tsx
    InspectionLoupe.tsx
    WatermarkOverlay.tsx
    BatchDock.tsx
    ExportDialog.tsx
    UploadZone.tsx

lib/
  ai/
  canvas/
  product-integrity/
  watermark/
  export/

store/
  studioStore.ts

types/
  studio.ts
```

Do not create files merely to satisfy a list. Keep architecture coherent.

---

# 8. STATE MODEL

Use Zustand.

Core state should include:

```ts
assets
activeAssetId

workflowStep

beforeImage
afterImage

enhancementPreset
backgroundPreset
lightingPreset

watermarkEnabled
watermarkPreset
watermarkOpacity
watermarkScale
watermarkRotation
watermarkSpacing

splitPosition
isLoupeActive
loupeMagnification

selectedAssetIds
isProcessing
```

Persist user presets, not large image binaries, in local persistence.

---

# 9. CANVAS REQUIREMENTS

## Before / After

Must support:
- mouse drag
- touch drag
- pointer events
- keyboard-accessible control where practical
- clamped 0–100 range
- smooth updates
- no unnecessary React re-render on every pointer movement

Prefer refs/requestAnimationFrame for high-frequency canvas updates.

Target smooth interaction around 60fps.

## Loupe

Default:
**200%**

The loupe should:
- follow pointer/touch position
- inspect label/product region
- use source-resolution imagery when available
- not alter source image
- be visually subtle

---

# 10. WATERMARK ENGINE

Implement Canvas-based watermark rendering.

Modes:

### Single Logo
One logo at selected anchor.

### Security Grid
Repeated balanced grid.

### Diagonal Security
Repeated diagonal security matrix.

Watermark can contain:
- MÂY COSMETICS
- YOUR BEAUTY, OUR PROMISE
- 0931 73 75 79

Use the real brand assets if available in `/public/assets/branding`.
Do not recreate a logo inaccurately with arbitrary text if an actual asset exists.

Smart placement:
- detect protected regions
- avoid product and label
- prefer background/negative-space areas
- adapt to aspect ratio

Watermark opacity defaults to subtle.

---

# 11. AI ARCHITECTURE

Do not hard-wire the UI to one provider.

Create a provider abstraction so the backend can later use:
- Gemini
- Fal.ai
- Replicate
- another compatible provider

Example conceptual interface:

```ts
interface ImageAIProvider {
  analyzeProduct(...)
  segmentProduct(...)
  enhanceBackground(...)
  generateBackground(...)
}
```

Credentials must be server-side only.

Never expose API keys to the browser.

Environment variables should be documented in `.env.example`.

---

# 12. PRODUCT INTEGRITY QA

The system should expose a clear internal QA status:

```text
Product Integrity
✓ Protected
```

For future/advanced QA, structure the code so it can compare:
- protected product region
- original product region
- generated result

Do not falsely report "100% unchanged" unless the implementation actually verifies it.

If confidence is low:
```text
Integrity review required
```

Prefer rejecting/retrying a generation over exporting a visibly damaged product.

---

# 13. BATCH LOGIC

The master workflow:

```text
User edits Asset A
      ↓
Asset A becomes MASTER
      ↓
Apply Master to All
      ↓
For each selected asset:
  adapt preset
  regenerate background if required
  preserve product
  adapt watermark
  run QA
      ↓
READY / REVIEW / FAILED
```

Do not overwrite original assets.

Statuses:

```text
Raw
Processing
Ready
Review
Protected
Failed
```

---

# 14. PERFORMANCE

Priorities:
1. canvas responsiveness
2. thumbnail virtualization/lazy loading where useful
3. avoid unnecessary React renders
4. use object URLs responsibly
5. revoke object URLs
6. do not load full-resolution assets into every thumbnail
7. debounce expensive operations
8. use Web Workers/off-main-thread processing when justified

Do not prematurely optimize simple UI state.

---

# 15. ERROR HANDLING

Every AI action must have:
- loading state
- progress/processing state
- success state
- recoverable error
- retry

Never leave the UI stuck indefinitely.

If AI credentials are missing:
- app must still run
- provide a clearly labeled demo/mock mode if appropriate
- never fabricate a successful production AI result

---

# 16. DEVELOPMENT PROTOCOL

You are an autonomous senior engineer.

Before coding:
1. inspect repository
2. inspect existing package.json
3. inspect existing source
4. inspect reference images
5. determine what already exists
6. make a concise implementation plan

Then execute.

Do not stop after generating code.

Run:

```bash
npm install
npm run lint
npx tsc --noEmit
npm run build
```

If scripts differ, inspect `package.json` and use the correct commands.

Fix errors and rerun validation.

Do not declare completion while TypeScript/build errors remain.

---

# 17. VISUAL QA

After implementation, inspect the running application.

Verify:
- canvas is dominant
- controls are understandable without documentation
- Soft Luxury visual language is consistent
- no excessive panels
- no enterprise-dashboard clutter
- Before/After feels immediate
- mobile layout is usable
- watermark remains subtle
- product/label is visually protected
- batch workflow is obvious

Compare against the reference images for **design language**, not pixel-level duplication.

---

# 18. ACCEPTANCE CRITERIA

The MVP is complete only when:

- [ ] app starts successfully
- [ ] TypeScript passes
- [ ] lint passes
- [ ] production build passes
- [ ] multi-image upload works
- [ ] active asset switching works
- [ ] Before/After slider works with mouse
- [ ] Before/After slider works with touch
- [ ] 200% loupe works
- [ ] enhancement presets work
- [ ] background workflow is separated from product pixels
- [ ] watermark presets work
- [ ] smart watermark placement works at a basic reliable level
- [ ] Apply Master to All works
- [ ] original assets remain untouched
- [ ] export works
- [ ] 1:1 / 4:5 / 9:16 / 16:9 exports work
- [ ] responsive layout works
- [ ] no obvious console/runtime errors

---

# 19. DEVELOPMENT PRIORITY

If time or complexity becomes a constraint, implement in this order:

```text
P0
Canvas + Upload + Before/After

P1
AI Enhance architecture + Background + Product protection

P2
Watermark Engine

P3
Batch

P4
Export

P5
Advanced AI / QA / polish
```

Never sacrifice Product Integrity to add a decorative feature.

Never sacrifice the core editing workflow to add Poster/Content functionality.

---


# 31. CRITICAL WORKFLOW BOUNDARY

The visible top-level workflow MUST remain:

UPLOAD → ENHANCE → PROTECT → EXPORT

Do NOT turn internal processing stages into additional top-level workflow steps.

The following are tools/states inside those four stages:
- product analysis
- product/label segmentation
- background generation
- lighting
- compositing
- integrity QA
- batch processing
- watermark placement
- export preparation

The UI must remain simple even if the underlying pipeline is sophisticated.

# 32. REAL AI VS DEMO MODE

AI functionality must have two explicit runtime modes.

REAL AI MODE:
- Use a configured server-side AI provider.
- Never expose provider credentials in the browser.
- Return real processing results and real errors.

DEMO MODE:
- Used only when no AI provider is configured.
- Must be visibly identified as Demo Mode.
- May use deterministic local/sample transformations.
- Must never claim that a real AI generation or analysis occurred.
- Must never fabricate AI confidence, integrity scores, or successful provider responses.

If an operation cannot actually be performed, report the limitation clearly.

# 33. PROTECTED COMPOSITING ARCHITECTURE

Background/environment generation must NOT treat the complete product image as freely editable generative content.

Preferred pipeline:

SOURCE IMAGE
→ PRODUCT / LABEL SEGMENTATION
→ PROTECTED PRODUCT REGION
→ GENERATE / EDIT BACKGROUND REGION
→ COMPOSITE ORIGINAL PRODUCT
→ EDGE / SHADOW REFINEMENT
→ PRODUCT INTEGRITY CHECK
→ RESULT

Whenever technically possible, reuse the original product pixels.

Protected regions include:
- product body
- cap/pump/dropper
- label
- printed typography
- physical logo
- formulation text
- important product details

Generative operations should primarily affect:
- background
- environment
- lighting environment
- shadow
- surrounding atmosphere
- composition outside protected regions

Never rely on negative prompts alone as a product-integrity mechanism.

# 34. WATERMARK FAIL-SAFE

Smart watermark placement must be conservative.

If protected-region detection is reliable:
- avoid product
- avoid label
- avoid important text
- avoid focal point
- prefer negative space

If detection confidence is insufficient:
1. never place the watermark over the detected product bounding box;
2. prefer safe image corners or negative-space regions;
3. if no safe region exists, mark the asset as Review Required;
4. never silently place a watermark over product text or packaging.

User override may be available, but the system should warn before a protected region is intentionally covered.

# 35. BATCH SAFETY

The master workflow MUST NOT blindly apply settings to every image.

Batch flow:

MASTER ASSET
→ PREVIEW 3 REPRESENTATIVE ASSETS
→ USER CONFIRMS
→ APPLY TO ALL
→ ADAPT PER ASSET
→ QA
→ READY / REVIEW / FAILED

Representative previews should cover meaningful variation where possible:
- different aspect ratios
- different product positions
- different backgrounds
- different image quality

If representative previews expose major integrity or composition problems, do not process the entire batch automatically.

Master settings must be normalized rather than copied as raw pixel coordinates.

# 36. OPERATION-BASED EDIT HISTORY

Undo/Redo must use operation history rather than storing unnecessary full-resolution image copies for every step.

Conceptual model:

```ts
type EditOperation = {
  id: string
  type:
    | "enhance"
    | "background"
    | "lighting"
    | "watermark"
    | "crop"
    | "resize"
  params: Record<string, unknown>
  timestamp: number
}

editHistory: EditOperation[]
historyIndex: number
```

Each operation must be reversible or reconstructable.

The original uploaded asset is immutable.

The application should preserve:
- original asset
- current edit state
- operation history
- export configuration

# 37. BRAND-AGNOSTIC CORE

MÂY is the default brand configuration, not a hard-coded application dependency.

Reusable components and core logic MUST NOT hard-code:
- MÂY logo
- MÂY colors
- MÂY phone number
- MÂY typography
- MÂY watermark text

Load brand-specific values from Brand Configuration.

The same Image Studio should work with another cosmetic brand by changing configuration/assets without rewriting core components.

Default MÂY configuration may contain:
- official MÂY logo
- MÂY brand colors
- MÂY typography
- MÂY visual references
- MÂY watermark presets

# 38. IMPLEMENTATION DEFINITION OF DONE

A feature is NOT complete merely because its UI exists.

For each implemented feature, verify:
1. UI state exists.
2. User interaction works.
3. Data/state flow works.
4. Loading state works.
5. Empty state works where relevant.
6. Error state works.
7. Success state works.
8. Undo/reset behavior is correct.
9. Original asset remains protected.
10. Relevant automated or manual regression test exists.

Never replace missing backend/AI behavior with a fake success state unless the application is explicitly in Demo Mode.

# 39. FINAL AUTONOMOUS LOOP

For each implementation phase:

INSPECT
→ PLAN
→ IMPLEMENT
→ RUN
→ TEST
→ VISUAL AUDIT
→ PRODUCT-INTEGRITY AUDIT
→ FIX
→ RE-RUN
→ REGRESSION TEST
→ PASS

Do not stop at:
- compilation success
- page rendering
- successful API connection
- static mock output

Completion requires functional verification of the user workflow.

# 20. FINAL PRODUCT PRINCIPLE

MÂY Image Studio should feel like:

> "I upload my cosmetic photos, MÂY makes them look premium, protects the product, and lets me export everything."

Not:

> "I have to learn a complicated creative operating system."

Build the simplest product that delivers that result.
