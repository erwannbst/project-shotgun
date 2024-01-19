import * as React from 'react'

import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '../ui/avatar'
import { Candidate, User } from '../../app/types'

const GreyCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex flex-col rounded-lg min-w-60 bg-card outline-dashed outline-slate-200 text-slate-400 items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors duration-250 ease-in-out p-3',
      className,
    )}
    {...props}
  />
))
GreyCard.displayName = 'GreyCard'

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex rounded-lg border bg-card text-card-foreground shadow-sm min-w-[200px] overflow-hidden',
      className,
    )}
    {...props}
  />
))
Card.displayName = 'Card'

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className,
    )}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
))
CardDescription.displayName = 'CardDescription'

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
))
CardContent.displayName = 'CardContent'

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'

type UserCardProps = {
  user: User
}

const UserCard = ({ user }: UserCardProps) => (
  <Card key={user.id}>
    <CardContent
      className={`flex w-full min-w-20 items-center p-2 gap-3 ${
        user.online ? '' : 'filter opacity-30'
      }`}
    >
      <Avatar>
        <AvatarFallback>{user.pseudo.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <p>{user.pseudo}</p>
      {user.online && <div className="w-2 h-2 rounded-full bg-green-500"></div>}
    </CardContent>
  </Card>
)

type CandidateCardProps = {
  candidate: Candidate
}

const CandidateCard = ({ candidate }: CandidateCardProps) => (
  <Card
    key={candidate.user.id}
    className={`${candidate.valid ? 'border-green-500' : ''}`}
  >
    <CardContent
      className={`flex w-full items-center p-2 gap-3 ${
        candidate.valid ? 'filter opacity-80 bg-green-100' : ''
      }`}
    >
      <Avatar>
        <AvatarFallback>{candidate.user.pseudo.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <p className="font-bold">{candidate.user.pseudo}</p>
        <p className="text-sm text-slate-800">
          {new Date(candidate.timestamp).toLocaleDateString('fr-FR', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })}
        </p>
      </div>
    </CardContent>
  </Card>
)

export {
  GreyCard,
  CandidateCard,
  UserCard,
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
}
