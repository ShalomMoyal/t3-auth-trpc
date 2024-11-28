"use client"

import { useRouter } from 'next/navigation'
import { User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"



export default function UserBadge() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/personal-area')
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-10 h-10"
            onClick={handleClick}
          >
            <User className="h-5 w-5" />
            <span className="sr-only">Go to personal area</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Personal Area</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}