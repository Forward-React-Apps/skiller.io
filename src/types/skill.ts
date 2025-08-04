export interface Milestone {
  id: string
  title: string
  completed: boolean
  completedAt?: string
}

export interface SkillCategory {
  id: string
  name: string
  color: string
}

export interface Skill {
  id: string
  name: string
  description: string
  category: string
  milestones: Milestone[]
  targetDate?: string
  createdAt: string
  updatedAt: string
  status: 'not-started' | 'in-progress' | 'completed'
}
