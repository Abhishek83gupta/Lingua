import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { DashboardContent } from "@/components/dashboard-content"

export default async function DashboardPage() {
  const session = await getServerSession()

  if (!session) {
    redirect("/sign-in")
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <DashboardContent />
    </div>
  )
}

