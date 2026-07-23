import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AppBar } from "../components/app-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Plus, Trash2, Save, ArrowLeft, Target, Calendar, BookOpen, Palette } from "lucide-react"
import type { Skill, SkillCategory, Milestone } from "@/types/skill"

// Mock categories (same as dashboard)
const mockCategories: SkillCategory[] = [
  { id: '1', name: 'Frontend Development', color: '#3B82F6' },
  { id: '2', name: 'Backend Development', color: '#10B981' },
  { id: '3', name: 'Programming Languages', color: '#F59E0B' },
  { id: '4', name: 'Database', color: '#8B5CF6' },
  { id: '5', name: 'Design', color: '#EF4444' },
  { id: '6', name: 'DevOps', color: '#6B7280' },
]

function Creation() {
  const navigate = useNavigate()
  const location = useLocation()
  const [skills, setSkills] = useLocalStorage<Skill[]>('user-skills', [])
  const [categories, setCategories] = useLocalStorage<SkillCategory[]>('skill-categories', mockCategories)
  
  // Check if we're editing an existing skill
  const editingSkill = location.state?.skill as Skill | undefined
  const isEditing = !!editingSkill

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    targetDate: ''
  })
  
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Category creation state
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newCategoryColor, setNewCategoryColor] = useState('#3B82F6')

  // Initialize form with existing skill data if editing
  useEffect(() => {
    if (editingSkill) {
      setFormData({
        name: editingSkill.name,
        description: editingSkill.description,
        category: editingSkill.category,
        targetDate: editingSkill.targetDate || ''
      })
      setMilestones(editingSkill.milestones)
    }
  }, [editingSkill])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const addMilestone = () => {
    const newMilestone: Milestone = {
      id: `milestone-${Date.now()}`,
      title: '',
      completed: false
    }
    setMilestones(prev => [...prev, newMilestone])
  }

  const updateMilestone = (id: string, field: keyof Milestone, value: string | boolean) => {
    setMilestones(prev => 
      prev.map(milestone => 
        milestone.id === id ? { ...milestone, [field]: value } : milestone
      )
    )
  }

  const removeMilestone = (id: string) => {
    setMilestones(prev => prev.filter(milestone => milestone.id !== id))
  }

  const addCategory = () => {
    if (!newCategoryName.trim()) return
    
    const newCategory: SkillCategory = {
      id: `category-${Date.now()}`,
      name: newCategoryName.trim(),
      color: newCategoryColor
    }
    
    setCategories(prev => [...prev, newCategory])
    setFormData(prev => ({ ...prev, category: newCategory.name }))
    setNewCategoryName('')
    setNewCategoryColor('#3B82F6')
    setShowCategoryForm(false)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }
    
    if (milestones.length === 0) {
      newErrors.milestones = 'At least one milestone is required'
    } else {
      const emptyMilestones = milestones.some(m => !m.title.trim())
      if (emptyMilestones) {
        newErrors.milestones = 'All milestones must have a title'
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const now = new Date().toISOString()
    const completedMilestones = milestones.filter(m => m.completed).length
    const totalMilestones = milestones.length
    
    let status: Skill['status'] = 'not-started'
    if (completedMilestones === totalMilestones) {
      status = 'completed'
    } else if (completedMilestones > 0) {
      status = 'in-progress'
    }

    const skillData: Skill = {
      id: editingSkill?.id || `skill-${Date.now()}`,
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      milestones: milestones,
      targetDate: formData.targetDate || undefined,
      createdAt: editingSkill?.createdAt || now,
      updatedAt: now,
      status
    }

    if (isEditing) {
      // Update existing skill
      setSkills(prev => 
        prev.map(skill => skill.id === editingSkill.id ? skillData : skill)
      )
    } else {
      // Add new skill
      setSkills(prev => [...prev, skillData])
    }

    navigate('/')
  }

  const handleCancel = () => {
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-background">
      <AppBar />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEditing ? 'Edit Skill' : 'Create New Skill'}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEditing 
                ? 'Update your skill details and milestones'
                : 'Define what you want to learn and set your learning milestones'
              }
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Start by defining what skill you want to learn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Name *</label>
                  <Input
                    placeholder="e.g., React Development, Python Programming"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={errors.name ? 'border-destructive' : ''}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description *</label>
                  <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    placeholder="Describe what you want to achieve with this skill..."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category *</label>
                    <div className="space-y-2">
                      <Select value={formData.category} onValueChange={(value: string) => handleInputChange('category', value)}>
                        <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
                          <Target className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
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
                      
                      {!showCategoryForm ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowCategoryForm(true)}
                          className="w-full gap-2"
                        >
                          <Plus className="h-4 w-4" />
                          Add New Category
                        </Button>
                      ) : (
                        <div className="border rounded-lg p-3 space-y-3">
                          <div className="flex items-center gap-2">
                            <Palette className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Create New Category</span>
                          </div>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Category name"
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                              className="flex-1"
                            />
                            <input
                              type="color"
                              value={newCategoryColor}
                              onChange={(e) => setNewCategoryColor(e.target.value)}
                              className="w-12 h-9 rounded border border-input cursor-pointer"
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={addCategory}
                              className="flex-1"
                            >
                              Add Category
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowCategoryForm(false)
                                setNewCategoryName('')
                                setNewCategoryColor('#3B82F6')
                              }}
                              className="flex-1"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors.category && (
                      <p className="text-sm text-destructive">{errors.category}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={formData.targetDate}
                        onChange={(e) => handleInputChange('targetDate', e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Learning Milestones
                    </CardTitle>
                    <CardDescription>
                      Break down your learning journey into achievable steps
                    </CardDescription>
                  </div>
                  <Button onClick={addMilestone} size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Milestone
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {milestones.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No milestones yet. Add your first milestone to get started!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {milestones.map((milestone, index) => (
                      <div key={milestone.id} className="border rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-muted-foreground">
                            Milestone {index + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMilestone(milestone.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <Input
                            placeholder="Milestone title (e.g., Learn React Basics)"
                            value={milestone.title}
                            onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.milestones && (
                  <p className="text-sm text-destructive">{errors.milestones}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>
                  See how your skill will appear on the dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.name ? (
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold">{formData.name}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {formData.description || 'No description yet...'}
                      </p>
                    </div>
                    
                    {formData.category && (
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <div 
                            className="w-2 h-2 rounded-full" 
                            style={{ 
                              backgroundColor: categories.find(c => c.name === formData.category)?.color || '#6B7280' 
                            }}
                          />
                          {formData.category}
                        </Badge>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Milestones</span>
                        <span>{milestones.filter(m => m.completed).length}/{milestones.length}</span>
                      </div>
                      
                      {milestones.length > 0 && (
                        <div className="space-y-1">
                          {milestones.slice(0, 3).map((milestone) => (
                            <div key={milestone.id} className="text-sm flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                              <span className="line-clamp-1">
                                {milestone.title || 'Untitled milestone'}
                              </span>
                            </div>
                          ))}
                          {milestones.length > 3 && (
                            <p className="text-xs text-muted-foreground">
                              +{milestones.length - 3} more milestones
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {formData.targetDate && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(formData.targetDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm">
                    Fill in the form to see a preview of your skill
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button onClick={handleSave} className="w-full gap-2">
                <Save className="h-4 w-4" />
                {isEditing ? 'Update Skill' : 'Create Skill'}
              </Button>
              <Button variant="outline" onClick={handleCancel} className="w-full">
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Creation