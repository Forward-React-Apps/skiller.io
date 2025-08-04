import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card"
import type { Skill, SkillCategory } from "@/types/skill"
import { Progress } from "./ui/progress"
import { Badge } from "./ui/badge"
import { Calendar, Target, CheckCircle2, Circle, Award } from "lucide-react"

export function SkillRoadmap({ skill, categories, formatShortDate, getDaysUntilTarget }: { skill: Skill, categories: SkillCategory[], formatShortDate: (date: string) => string, getDaysUntilTarget: (date: string) => number }) {
    const completedMilestones = skill.milestones.filter(m => m.completed).length
    const totalMilestones = skill.milestones.length
    const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
    const categoryColor = categories.find(c => c.name === skill.category)?.color || '#6B7280'

    
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
                                {skill.milestones.map((milestone) => (
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
}
