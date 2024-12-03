import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { User, FileText, Heart } from 'lucide-react'

export function Sidebar() {
  return (
    <aside className="w-64 bg-background border-r h-screen p-4">
      <nav className="space-y-2">
        <Link href="/dashboard/profile">
          <Button variant="ghost" className="w-full justify-start">
            <User className="mr-2 h-4 w-4" />
            Update Profile
          </Button>
        </Link>
        <Link href="/dashboard/posts">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" />
            My Posts
          </Button>
        </Link>
        <Link href="/dashboard/favorites">
          <Button variant="ghost" className="w-full justify-start">
            <Heart className="mr-2 h-4 w-4" />
            Favorite Posts
          </Button>
        </Link>
      </nav>
    </aside>
  )
}

