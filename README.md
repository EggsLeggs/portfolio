# Portfolio

A modern, static React portfolio site built with Vite, TypeScript, Tailwind CSS, and GSAP animations.

## Features

- **Config-driven content** - Easily manage your portfolio data through YAML files
- **Featured & regular projects** - Showcase your best work with featured projects
- **Custom project tags** - Tag projects (hackathon, quick-tool, thinkhuman, etc.)
- **Certifications section** - Display badges with certificate preview (PDF & PNG support)
- **Memberships section** - Show professional organization memberships with active/expired status
- **Smooth animations** - Subtle GSAP scroll animations throughout
- **Responsive design** - Two-column layout on desktop, single column on mobile
- **Dark theme** - Modern dark design with cyan and purple accents
- **Static site** - Deployable to GitHub Pages, Netlify, Vercel, etc.

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit http://localhost:5173 (or the port shown in your terminal)

### Build

```bash
npm run build
```

The static site will be built to the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Customizing Your Portfolio

All portfolio content is managed through YAML configuration files in the `src/config` directory.

### 1. Personal Information (`src/config/config.yaml`)

Update your personal details, social links, and navigation:

```yaml
name: Your Name
title: Your Title
email: your.email@example.com
location: Your Location

about: |
  Write your about section here...

social:
  - name: LinkedIn
    url: https://linkedin.com/in/yourprofile
    icon: linkedin
  - name: GitHub
    url: https://github.com/yourusername
    icon: github
```

### 2. Experience (`src/config/experience.yaml`)

Add your work experience:

```yaml
- company: Company Name
  position: Your Position
  location: City, State
  startDate: 2023-01
  endDate: present
  description: Brief role description
  highlights:
    - Achievement #1
    - Achievement #2
  technologies:
    - React
    - TypeScript
  url: https://company.com
```

### 3. Projects (`src/config/projects.yaml`)

Add your projects:

```yaml
- title: Project Name
  description: Project description
  featured: true  # Featured projects appear first
  date: 2024-11-15
  technologies:
    - React
    - TypeScript
  links:
    - type: github
      url: https://github.com/you/project
    - type: demo
      url: https://demo.com
  tags:
    - hackathon  # or quick-tool, thinkhuman
```

### 4. Project Tags

You can add new project tags in `src/config/config.yaml`:

```yaml
projectTags:
  - id: your-tag-id
    label: Display Label
    color: cyan  # cyan, purple, blue, or custom
```

Then update the color mapping in `src/components/sections/Projects.tsx` if using custom colors.

### 5. Project Visibility

Control how many projects are shown initially:

```yaml
projects:
  maxVisible: 6  # Number of projects shown before "Show All"
```

### 6. Certifications (`src/config/certifications.yaml`)

Add your professional certifications:

```yaml
- name: AWS Certified Solutions Architect
  issuer: Amazon Web Services
  date: 2024-01
  badge: /portfolio/badges/aws-solutions-architect.png  # Badge image (required)
  certificate: /portfolio/certificates/aws-cert.pdf      # Certificate file (optional - PDF or PNG)
  url: https://www.credly.com/badges/your-id  # Verification link (optional)
  description: Brief description of the certification
```

**Important Notes:**
- Place badge images in the `public/badges/` directory
- Place certificate files in the `public/certificates/` directory
- Use `/portfolio/` prefix in paths to match the base path configuration
- Supports both PDF and PNG/JPG certificate files
- Click on badges to preview certificates in a modal
- If no certificate file is provided, only the badge and verification link will be shown

### 7. Memberships (`src/config/memberships.yaml`)

Add your professional memberships:

```yaml
- organization: IEEE
  fullName: Institute of Electrical and Electronics Engineers
  membershipType: Student Member  # e.g., Student, Professional, Fellow
  startDate: 2023-01
  endDate: present  # or specific date like 2024-12
  logo: /portfolio/memberships/ieee-logo.png
  memberId: "12345678"  # Optional
  url: https://www.ieee.org
  description: Brief description of the organization
```

**Important Notes:**
- Place organization logos in the `public/memberships/` directory
- Use `/portfolio/` prefix in paths to match the base path configuration
- Member ID is optional and will be displayed if provided
- URL links to the organization's website or your member profile
- Use `endDate: present` for active memberships

## Deployment

### GitHub Pages

1. Update `vite.config.ts` with your base path:

```typescript
export default defineConfig({
  base: '/repository-name/',
  // ...
})
```

2. Build and deploy:

```bash
npm run build
# Then deploy the dist folder to GitHub Pages
```

### Netlify / Vercel

1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **shadcn/ui** - Component library base
- **GSAP** - Animations
- **js-yaml** - YAML parsing

## Project Structure

```
portfolio/
├── src/
│   ├── components/       # React components
│   │   ├── sections/    # Page sections (About, Experience, Projects)
│   │   ├── ui/          # shadcn/ui components
│   │   ├── Layout.tsx
│   │   └── Sidebar.tsx
│   ├── config/          # YAML configuration files
│   │   ├── config.yaml
│   │   ├── experience.yaml
│   │   └── projects.yaml
│   ├── hooks/           # React hooks
│   ├── lib/             # Utilities
│   ├── types/           # TypeScript types
│   └── App.tsx
└── package.json
```

## License

MIT - Feel free to use this template for your own portfolio!
