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
      } ${user.hasProject ? 'bg-green-200 border-green-500' : ''}`}
    >
      <Avatar>
        {user.hasProject ? (
          <div className="flex z-50 absolute inset-0 rounded-3xl bg-green-100/60 text-green-600 font-bold p-1 text-center items-center justify-center self-center backdrop-brightness-150">
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 4.63601C5 3.76031 5.24219 3.1054 5.64323 2.67357C6.03934 2.24705 6.64582 1.9783 7.5014 1.9783C8.35745 1.9783 8.96306 2.24652 9.35823 2.67208C9.75838 3.10299 10 3.75708 10 4.63325V5.99999H5V4.63601ZM4 5.99999V4.63601C4 3.58148 4.29339 2.65754 4.91049 1.99307C5.53252 1.32329 6.42675 0.978302 7.5014 0.978302C8.57583 0.978302 9.46952 1.32233 10.091 1.99162C10.7076 2.65557 11 3.57896 11 4.63325V5.99999H12C12.5523 5.99999 13 6.44771 13 6.99999V13C13 13.5523 12.5523 14 12 14H3C2.44772 14 2 13.5523 2 13V6.99999C2 6.44771 2.44772 5.99999 3 5.99999H4ZM3 6.99999H12V13H3V6.99999Z"
                fill="currentColor"
                fill-rule="evenodd"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
        ) : (
          <AvatarFallback>{user.pseudo.slice(0, 2)}</AvatarFallback>
        )}
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
    className={`${candidate.owner ? 'border-green-500' : ''}`}
  >
    <CardContent
      className={`flex w-full items-center p-2 gap-3 ${
        candidate.owner ? 'filter opacity-80 bg-green-100' : ''
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
