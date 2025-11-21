// Quiz Round Format Types
export type RoundFormat =
  | 'general-knowledge'
  | 'picture'
  | 'music'
  | 'connections'
  | 'true-false'
  | 'multiple-choice'
  | 'easy-hard'
  | 'all-nothing'
  | 'top-5'
  | '54321'
  | 'bonus'
  | 'fill-blank'
  | 'odd-one-out'
  | 'what-comes-next'

export interface Round {
  id: number
  roundNumber: number
  format: RoundFormat
  questions: Question[]
  score: number
  maxScore: number
}

export interface Question {
  id: number
  text: string
  answer: string
  isCorrect: boolean | null
  points?: number
  maxPoints?: number
}

export interface Team {
  id: string
  name: string
  createdBy: string
  members: string[]
  createdAt: string
}

export interface QuizAttempt {
  id: string
  quizId: string
  teamId: string
  userId: string
  date: string
  rounds: Round[]
  totalScore: number
  maxScore: number
  percentage: number
}

export interface User {
  id: string
  email: string
  displayName: string
  createdAt: string
}
