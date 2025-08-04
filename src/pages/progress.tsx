import { AppBar } from "../components/app-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Award, 
  Calendar,
  Flame,
  Trophy,
  Clock,
  CheckCircle2
} from "lucide-react"
import type { Skill, SkillCategory } from "@/types/skill"
import { StatisticCard } from "@/components/statistic-card"

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

function Progress() {
  const [skills] = useLocalStorage<Skill[]>('user-skills', mockSkills)
  const [categories] = useLocalStorage<SkillCategory[]>('skill-categories', mockCategories)
  const [lastActivityDate, setLastActivityDate] = useLocalStorage<string>('last-activity-date', '')
  const [currentStreak, setCurrentStreak] = useLocalStorage<number>('current-streak', 0)
  const [longestStreak, setLongestStreak] = useLocalStorage<number>('longest-streak', 0)

  // Calculate statistics
  const totalSkills = skills.length
  const completedSkills = skills.filter(skill => skill.status === 'completed').length
  const inProgressSkills = skills.filter(skill => skill.status === 'in-progress').length
  const averageProgress = totalSkills > 0 
    ? Math.round(skills.reduce((sum, skill) => {
        const skillProgress = skill.milestones.length > 0 
          ? (skill.milestones.filter(m => m.completed).length / skill.milestones.length) * 100 
          : 0
        return sum + skillProgress
      }, 0) / totalSkills)
    : 0

  // Calculate total milestones
  const totalMilestones = skills.reduce((sum, skill) => sum + skill.milestones.length, 0)
  const completedMilestones = skills.reduce((sum, skill) => 
    sum + skill.milestones.filter(m => m.completed).length, 0
  )

  // Update streak based on current date
  const updateStreak = () => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    
    if (lastActivityDate === today) {
      // Already updated today, no change
      return
    }
    
    if (lastActivityDate === yesterday) {
      // Consecutive day, increment streak
      const newStreak = currentStreak + 1
      setCurrentStreak(newStreak)
      setLongestStreak(Math.max(longestStreak, newStreak))
    } else if (lastActivityDate === '') {
      // First time, start streak
      setCurrentStreak(1)
      setLongestStreak(1)
    } else {
      // Streak broken, reset
      setCurrentStreak(1)
    }
    
    setLastActivityDate(today)
  }

  // Check for activity (completed milestones today)
  const hasActivityToday = skills.some(skill => 
    skill.milestones.some(milestone => 
      milestone.completed && 
      milestone.completedAt && 
      new Date(milestone.completedAt).toDateString() === new Date().toDateString()
    )
  )

  // Update streak if there's activity today
  if (hasActivityToday) {
    updateStreak()
  }

  const getStreakIcon = (streak: number) => {
    if (streak >= 30) return <Flame className="h-5 w-5 text-orange-500" />
    if (streak >= 14) return <Flame className="h-5 w-5 text-red-500" />
    if (streak >= 7) return <Flame className="h-5 w-5 text-yellow-500" />
    if (streak >= 3) return <Flame className="h-5 w-5 text-blue-500" />
    return <Flame className="h-5 w-5 text-gray-400" />
  }

  const getStreakBadge = (streak: number) => {
    if (streak >= 30) return { text: "Fire Master!", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" }
    if (streak >= 14) return { text: "On Fire!", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" }
    if (streak >= 7) return { text: "Hot Streak!", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" }
    if (streak >= 3) return { text: "Getting Warm", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" }
    return { text: "Just Started", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200" }
  }

  // Recent activity (milestones completed in last 7 days)
  const recentActivity = skills.flatMap(skill => 
    skill.milestones
      .filter(milestone => {
        if (!milestone.completed || !milestone.completedAt) return false
        const completedDate = new Date(milestone.completedAt)
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        return completedDate >= weekAgo
      })
      .map(milestone => ({
        ...milestone,
        skillName: skill.name,
        skillCategory: skill.category
      }))
  ).sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    })
  }

  const streakBadge = getStreakBadge(currentStreak)

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Progress Summary</h1>
          <p className="text-muted-foreground">
            Track your learning achievements, streaks, and overall progress
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatisticCard text="Total Skills" icon={<BookOpen className="h-4 w-4 text-muted-foreground" />} value={totalSkills} description="Skills in your learning path" />
          <StatisticCard text="Completed Skills" icon={<Award className="h-4 w-4 text-muted-foreground" />} value={completedSkills} description="Skills mastered" color="text-green-600" />
          <StatisticCard text="In Progress Skills" icon={<Target className="h-4 w-4 text-muted-foreground" />} value={inProgressSkills} description="Skills currently learning" color="text-blue-600" />
          <StatisticCard text="Average Progress" icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />} value={averageProgress + "%"} description="Average progress across skills" />

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Streak Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getStreakIcon(currentStreak)}
                  Learning Streak
                </CardTitle>
                <CardDescription>
                  Keep your learning momentum going!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{currentStreak}</div>
                  <Badge className={streakBadge.color} variant="secondary">
                    {streakBadge.text}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold">{longestStreak}</div>
                    <div className="text-xs text-muted-foreground">Best Streak</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{completedMilestones}</div>
                    <div className="text-xs text-muted-foreground">Total Milestones</div>
                  </div>
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  {hasActivityToday ? (
                    <div className="flex items-center justify-center gap-1 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Active today!
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      Complete milestones daily to continue your streak
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Milestones Overview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Milestones Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Progress</span>
                    <span className="font-medium">{completedMilestones}/{totalMilestones}</span>
                  </div>
                  
                  <div className="space-y-2">
                    {categories.map(category => {
                      const categorySkills = skills.filter(skill => skill.category === category.name)
                      const categoryMilestones = categorySkills.reduce((sum, skill) => sum + skill.milestones.length, 0)
                      const categoryCompleted = categorySkills.reduce((sum, skill) => 
                        sum + skill.milestones.filter(m => m.completed).length, 0
                      )
                      
                      if (categoryMilestones === 0) return null
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                          <span className="font-medium">{categoryCompleted}/{categoryMilestones}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Milestones completed in the last 7 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-3">
                    {recentActivity.map((activity, index) => (
                      <div key={`${activity.id}-${index}`} className="flex items-center gap-3 p-3 rounded-lg border bg-card/30">
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium line-clamp-1">{activity.title}</div>
                          <div className="text-sm text-muted-foreground">
                            {activity.skillName} • {activity.skillCategory}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(activity.completedAt!)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-sm">Complete some milestones to see your progress here!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Progress