import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Edit, Eye, Target, CheckCircle2, Circle } from "lucide-react"
import type { Skill, Milestone } from "@/types/skill"

interface SkillCardProps {
  skill: Skill
  onEdit?: (skill: Skill) => void
  onView?: (skill: Skill) => void
  onToggleMilestone?: (skillId: string, milestoneId: string) => void
}

export function SkillCard({ skill, onEdit, onView, onToggleMilestone }: SkillCardProps) {
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
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const completedMilestones = skill.milestones.filter(m => m.completed).length
  const totalMilestones = skill.milestones.length
  const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1">
              {skill.name}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {skill.description}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(skill.status)} variant="secondary">
            {getStatusText(skill.status)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Milestones</span>
            <span className="font-medium">{completedMilestones}/{totalMilestones} ({progressPercentage}%)</span>
          </div>
          
          <Progress value={progressPercentage} className="h-2" />
          
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {skill.milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                className="flex items-center gap-2 text-sm cursor-pointer hover:bg-muted/50 p-1 rounded transition-colors"
                onClick={() => onToggleMilestone?.(skill.id, milestone.id)}
              >
                {milestone.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                )}
                <span className={`line-clamp-1 ${milestone.completed ? 'line-through text-muted-foreground' : ''}`}>
                  {milestone.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span>{skill.category}</span>
          </div>
          {skill.targetDate && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(skill.targetDate)}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView?.(skill)}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit?.(skill)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}