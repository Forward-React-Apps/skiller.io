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

function Progress() {
  const [skills] = useLocalStorage<Skill[]>('user-skills', [])
  const [categories] = useLocalStorage<SkillCategory[]>('skill-categories', [])
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