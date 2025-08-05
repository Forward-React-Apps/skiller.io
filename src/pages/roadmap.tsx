import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AppBar } from "../components/app-bar"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { 
  Target, 
  Clock, 
  Filter,
  BookOpen,
} from "lucide-react"
import type { Skill, SkillCategory } from "@/types/skill"
import { SkillRoadmap } from "@/components/skill-roadmap"

function Roadmap() {
  const location = useLocation()
  const [skills] = useLocalStorage<Skill[]>('user-skills', [])
  const [categories] = useLocalStorage<SkillCategory[]>('skill-categories', [])
  
  // Check if we're viewing a specific skill
  const viewingSkill = location.state?.skill as Skill | undefined
  
  // Filter and sort states
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('created')

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
            {skillsToShow.map((skill) => {
              return (
                <SkillRoadmap key={skill.id} skill={skill} categories={categories} formatShortDate={formatShortDate} getDaysUntilTarget={getDaysUntilTarget} />
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