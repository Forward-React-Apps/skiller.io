import { AppBar } from "../components/app-bar"
import { SkillCard } from "../components/skill-card"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Plus, BookOpen, Target, TrendingUp, Award, Search, Filter, SortAsc } from "lucide-react"
import { useNavigate } from "react-router"

import type { Skill, SkillCategory } from "@/types/skill"

// Mock categories
const mockCategories: SkillCategory[] = [
  { id: '1', name: 'Frontend Development', color: '#3B82F6' },
  { id: '2', name: 'Backend Development', color: '#10B981' },
  { id: '3', name: 'Programming Languages', color: '#F59E0B' },
  { id: '4', name: 'Database', color: '#8B5CF6' },
  { id: '5', name: 'Design', color: '#EF4444' },
  { id: '6', name: 'DevOps', color: '#6B7280' },
]

// Temporary mock data for demonstration
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

function Dashboard() {
  const navigate = useNavigate()
  const [skills, setSkills] = useLocalStorage<Skill[]>('user-skills', mockSkills)
  const [categories, setCategories] = useLocalStorage<SkillCategory[]>('skill-categories', mockCategories)
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('skills-search', '')
  const [statusFilter, setStatusFilter] = useLocalStorage<string>('skills-status-filter', 'all')
  const [categoryFilter, setCategoryFilter] = useLocalStorage<string>('skills-category-filter', 'all')
  const [sortBy, setSortBy] = useLocalStorage<string>('skills-sort', 'name')

  const handleToggleMilestone = (skillId: string, milestoneId: string) => {
    setSkills(prevSkills => 
      prevSkills.map(skill => {
        if (skill.id === skillId) {
          const updatedMilestones = skill.milestones.map(milestone => {
            if (milestone.id === milestoneId) {
              const isCompleting = !milestone.completed
              return {
                ...milestone,
                completed: isCompleting,
                completedAt: isCompleting ? new Date().toISOString() : undefined
              }
            }
            return milestone
          })
          
          // Update skill status based on milestone completion
          const completedCount = updatedMilestones.filter(m => m.completed).length
          const totalCount = updatedMilestones.length
          let newStatus: Skill['status'] = 'not-started'
          
          if (completedCount === totalCount) {
            newStatus = 'completed'
          } else if (completedCount > 0) {
            newStatus = 'in-progress'
          }
          
          return {
            ...skill,
            milestones: updatedMilestones,
            status: newStatus,
            updatedAt: new Date().toISOString()
          }
        }
        return skill
      })
    )
  }

  const handleEditSkill = (skill: Skill) => {
    // Navigate to creation page with skill data
    navigate('/creation', { state: { skill } })
  }

  const handleViewSkill = (skill: Skill) => {
    // Navigate to roadmap page with skill data
    navigate('/roadmap', { state: { skill } })
  }

  const handleAddSkill = () => {
    navigate('/creation')
  }

  // Filter and sort skills
  const filteredAndSortedSkills = skills
    .filter(skill => {
      const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           skill.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || skill.status === statusFilter
      const matchesCategory = categoryFilter === 'all' || skill.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'progress':
          const aProgress = a.milestones.length > 0 ? (a.milestones.filter(m => m.completed).length / a.milestones.length) * 100 : 0
          const bProgress = b.milestones.length > 0 ? (b.milestones.filter(m => m.completed).length / b.milestones.length) * 100 : 0
          return bProgress - aProgress
        case 'category':
          return a.category.localeCompare(b.category)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'target':
          if (!a.targetDate && !b.targetDate) return 0
          if (!a.targetDate) return 1
          if (!b.targetDate) return -1
          return new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Skills Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Track your learning progress and manage your skill development journey
            </p>
          </div>
          <Button onClick={handleAddSkill} className="gap-2 self-start sm:self-auto">
            <Plus className="h-4 w-4" />
            Add New Skill
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-card rounded-lg border p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
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
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                  <SelectItem value="category">Category</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="created">Created Date</SelectItem>
                  <SelectItem value="target">Target Date</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        {filteredAndSortedSkills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                onEdit={handleEditSkill}
                onView={handleViewSkill}
                onToggleMilestone={handleToggleMilestone}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <CardTitle>
                {skills.length === 0 ? "No Skills Yet" : "No Skills Found"}
              </CardTitle>
              <CardDescription>
                {skills.length === 0 
                  ? "Start your learning journey by adding your first skill"
                  : "Try adjusting your search or filter criteria"
                }
              </CardDescription>
            </CardHeader>
            {skills.length === 0 && (
              <CardContent>
                <Button onClick={handleAddSkill} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Your First Skill
                </Button>
              </CardContent>
            )}
          </Card>
        )}
      </main>
    </div>
  )
}

export default Dashboard