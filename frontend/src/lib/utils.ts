import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Project, Shotgun } from '../app/types'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function addProjectToShotgun(shotgun: Shotgun, projectName: string) {
  return fetch(`http://localhost:3001/shotguns/${shotgun.id}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: projectName }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('Success:', data)
      return data
    })
    .catch((error) => {
      console.error('Error:', error)
    })
}
