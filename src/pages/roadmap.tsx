import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppBar } from "../components/app-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { 
  Calendar, 
  Target, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Filter,
  BookOpen,
  Award
} from "lucide-react"
import type { Skill, SkillCategory } from "@/types/skill"

// Mock categories (same as dashboard)
const mockCategories: SkillCategory[] = [
  { id: '1', name: 'Frontend Development', color: '#3B82F6' },
  { id: '2', name: 'Backend Development', color: '#10B981' },
  { id: '3', name: 'Programming Languages', color: '#F59E0B' },
  { id: '4', name: 'Database', color: '#8B5CF6' },
  { id: '5', name: 'Design', color: '#EF4444' },
  { id: '6', name: 'DevOps', color: '#6B7280' },
]

// Mock skills (same as dashboard)
const mockSkills: Skill[] = [
  {
    id: '1',
    name: 'React Development',
    description: 'Master modern React development with hooks, context, and advanced patterns',
    category: 'Frontend Development',
    milestones: [
      { id: '1-1', title: 'Learn React Basics', completed: true, completedAt: '2025-01-10T00:00:00Z' },
      { id: '1-2', title: 'Master React Hooks', completed: true, completedAt: '2025-01-15T00:00:00Z' },
      { id: '1-3', title: 'Context API & State Management', completed: true, completedAt: '2025-01-20T00:00:00Z' },
      { id: '1-4', title: 'Advanced Patterns', completed: false },
    ],
    targetDate: '2025-03-15',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
    status: 'in-progress'
  },
  {
    id: '2',
    name: 'TypeScript Fundamentals',
    description: 'Learn TypeScript basics, advanced types, and best practices',
    category: 'Programming Languages',
    milestones: [
      { id: '2-1', title: 'Basic Types', completed: true, completedAt: '2024-12-20T00:00:00Z' },
      { id: '2-2', title: 'Interfaces & Types', completed: true, completedAt: '2025-01-05T00:00:00Z' },
      { id: '2-3', title: 'Generics', completed: true, completedAt: '2025-01-15T00:00:00Z' },
      { id: '2-4', title: 'Advanced Types', completed: true, completedAt: '2025-01-18T00:00:00Z' },
      { id: '2-5', title: 'Best Practices', completed: false },
    ],
    targetDate: '2025-02-28',
    createdAt: '2024-12-15T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
    status: 'in-progress'
  },
  {
    id: '3',
    name: 'Node.js Backend',
    description: 'Build scalable backend applications with Node.js and Express',
    category: 'Backend Development',
    milestones: [
      { id: '3-1', title: 'Node.js Basics', completed: true, completedAt: '2025-01-12T00:00:00Z' },
      { id: '3-2', title: 'Express Framework', completed: true, completedAt: '2025-01-18T00:00:00Z' },
      { id: '3-3', title: 'Database Integration', completed: false },
      { id: '3-4', title: 'Authentication', completed: false },
      { id: '3-5', title: 'API Development', completed: false },
    ],
    targetDate: '2025-04-30',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-22T00:00:00Z',
    status: 'in-progress'
  },
  {
    id: '4',
    name: 'Database Design',
    description: 'Learn SQL, database normalization, and optimization techniques',
    category: 'Database',
    milestones: [
      { id: '4-1', title: 'SQL Basics', completed: true, completedAt: '2024-11-15T00:00:00Z' },
      { id: '4-2', title: 'Database Design', completed: true, completedAt: '2024-12-01T00:00:00Z' },
      { id: '4-3', title: 'Advanced Queries', completed: true, completedAt: '2024-12-10T00:00:00Z' },
      { id: '4-4', title: 'Performance Optimization', completed: true, completedAt: '2024-12-20T00:00:00Z' },
    ],
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-12-20T00:00:00Z',
    status: 'completed'
  },
  {
    id: '5',
    name: 'UI/UX Design Principles',
    description: 'Understand design thinking, user research, and interface design',
    category: 'Design',
    milestones: [
      { id: '5-1', title: 'Design Fundamentals', completed: true, completedAt: '2025-01-21T00:00:00Z' },
      { id: '5-2', title: 'User Research', completed: false },
      { id: '5-3', title: 'Wireframing', completed: false },
      { id: '5-4', title: 'Prototyping', completed: false },
      { id: '5-5', title: 'Design Systems', completed: false },
    ],
    targetDate: '2025-06-15',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-22T00:00:00Z',
    status: 'in-progress'
  },
  {
    id: '6',
    name: 'DevOps Fundamentals',
    description: 'Learn CI/CD, containerization, and cloud deployment strategies',
    category: 'DevOps',
    milestones: [
      { id: '6-1', title: 'Version Control', completed: false },
      { id: '6-2', title: 'Containerization', completed: false },
      { id: '6-3', title: 'CI/CD Pipelines', completed: false },
      { id: '6-4', title: 'Cloud Platforms', completed: false },
      { id: '6-5', title: 'Monitoring', completed: false },
    ],
    targetDate: '2025-08-01',
    createdAt: '2025-01-22T00:00:00Z',
    updatedAt: '2025-01-22T00:00:00Z',
    status: 'not-started'
  }
]

function Roadmap() {
  const location = useLocation()
  const [skills] = useLocalStorage<Skill[]>('user-skills', mockSkills)
  const [categories] = useLocalStorage<SkillCategory[]>('skill-categories', mockCategories)
  
  // Check if we're viewing a specific skill
  const viewingSkill = location.state?.skill as Skill | undefined
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created')

  const getStatusColor = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'not-started':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
    }
  }

  const getStatusText = (status: Skill['status']) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'in-progress':
        return 'In Progress'
      case 'not-started':
        return 'Not Started'
      default:
        return 'Unknown'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate)
    const today = new Date()
    const diffTime = target.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Filter and sort skills
  const filteredAndSortedSkills = skills
    .filter(skill => {
      const matchesStatus = statusFilter === 'all' || skill.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter
      return matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'created':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case 'target':
          if (!a.targetDate && !b.targetDate) return 0
          if (!a.targetDate) return 1
          if (!b.targetDate) return -1
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
        case 'progress':
          const aProgress = a.milestones.length > 0 ? (a.milestones.filter(m => m.completed).length / a.milestones.length) * 100 : 0
          const bProgress = b.milestones.length > 0 ? (b.milestones.filter(m => m.completed).length / b.milestones.length) * 100 : 0
          return bProgress - aProgress
        default:
          return 0
      }
    })

  // If viewing a specific skill, show only that skill
  const skillsToShow = viewingSkill ? [viewingSkill] : filteredAndSortedSkills

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {viewingSkill ? `${viewingSkill.name} Roadmap` : 'Learning Roadmap'}
          </h1>
          <p className="text-muted-foreground">
            {viewingSkill 
              ? 'Track your progress through this skill\'s milestones'
              : 'Your learning journey timeline - see how your skills progress over time'
            }
          </p>
        </div>

        {/* Filters - only show if not viewing specific skill */}
        {!viewingSkill && (
          <div className="bg-card rounded-lg border p-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <Target className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.name}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="target">Target Date</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />
          
          <div className="space-y-8">
            {skillsToShow.map((skill, index) => {
              const completedMilestones = skill.milestones.filter(m => m.completed).length
              const totalMilestones = skill.milestones.length
              const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
              const categoryColor = categories.find(c => c.name === skill.category)?.color || '#6B7280'
              
              return (
                <div key={skill.id} className="relative flex items-start gap-6">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div 
                      className="w-4 h-4 rounded-full border-4 border-background"
                      style={{ backgroundColor: categoryColor }}
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <Card className="hover:shadow-md transition-all duration-200">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <CardTitle className="text-lg">{skill.name}</CardTitle>
                              <Badge className={getStatusColor(skill.status)} variant="secondary">
                                {getStatusText(skill.status)}
                              </Badge>
                            </div>
                            <CardDescription className="text-sm">
                              {skill.description}
                            </CardDescription>
                            
                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>Started {formatShortDate(skill.createdAt)}</span>
                              </div>
                              {skill.targetDate && (
                                <div className="flex items-center gap-1">
                                  <Target className="h-3 w-3" />
                                  <span>
                                    {skill.status === 'completed' ? (
                                      <>Completed: {formatShortDate(skill.updatedAt)}</>
                                    ) : (
                                      <>
                                        Target: {formatShortDate(skill.targetDate)}
                                        {(() => {
                                          const days = getDaysUntilTarget(skill.targetDate)
                                          if (days > 0) return ` (${days} days left)`
                                          if (days === 0) return ' (Due today)'
                                          return ` (${Math.abs(days)} days overdue)`
                                        })()}
                                      </>
                                    )}
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <div 
                                  className="w-2 h-2 rounded-full" 
                                  style={{ backgroundColor: categoryColor }}
                                />
                                <span>{skill.category}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        {/* Progress Overview */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Overall Progress</span>
                            <span className="text-sm font-medium">{completedMilestones}/{totalMilestones} ({progressPercentage}%)</span>
                          </div>
                          <Progress value={progressPercentage} className="h-2" />
                        </div>
                        
                        {/* Milestones */}
                        <div className="space-y-2">
                          <div className="grid gap-2">
                            {skill.milestones.map((milestone, milestoneIndex) => (
                              <div 
                                key={milestone.id}
                                className="flex items-center gap-2 p-2 rounded border bg-card/30 hover:bg-card/50 transition-colors"
                              >
                                <div className="flex-shrink-0">
                                  {milestone.completed ? (
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <Circle className="h-4 w-4 text-muted-foreground" />
                                  )}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <span className={`text-sm ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                                      {milestone.title}
                                    </span>
                                  {milestone.completed && milestone.completedAt && (
                                    <div className="flex items-center gap-1">
                                      <Award className="h-2 w-2 text-green-600" />
                                      <span className="text-xs text-green-600 opacity-75">
                                        Completed {formatShortDate(milestone.completedAt)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-2 pt-3 border-t text-center">
                          <div className="text-center">
                            <div className="text-lg font-bold text-green-600">{completedMilestones}</div>
                            <div className="text-xs text-muted-foreground">Done</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold text-blue-600">{totalMilestones - completedMilestones}</div>
                            <div className="text-xs text-muted-foreground">Left</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">{progressPercentage}%</div>
                            <div className="text-xs text-muted-foreground">Done</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-bold">
                              {(() => {
                                const created = new Date(skill.createdAt)
                                const now = new Date()
                                const diffTime = now.getTime() - created.getTime()
                                const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                                return diffDays
                              })()}
                            </div>
                            <div className="text-xs text-muted-foreground">Days</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
          
          {skillsToShow.length === 0 && (
            <Card className="text-center py-12">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <CardTitle>No Skills Found</CardTitle>
                <CardDescription>
                  Try adjusting your filter criteria or add some skills to get started
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}

export default Roadmap