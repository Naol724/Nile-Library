import React from 'react'
import { cn } from '@/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  padding?: 'sm' | 'md' | 'lg'
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  hover = false,
  padding = 'md'
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  return (
    <div 
      className={cn(
        'bg-white rounded-lg shadow-md border border-gray-200',
        hover && 'hover:shadow-lg transition-shadow duration-200',
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  )
}

export { Card }
export default Card
