import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { PrismaClient } from "@prisma/client"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

const prisma = new PrismaClient()

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { isFavorite } = await req.json()

    // Verify the translation belongs to the user
    const translation = await prisma.translationHistory.findUnique({
      where: {
        id: params.id,
      },
    })

    if (!translation || translation.userId !== session.user.id) {
      return NextResponse.json({ message: "Not found or not authorized" }, { status: 404 })
    }

    // Update the favorite status
    const updatedTranslation = await prisma.translationHistory.update({
      where: {
        id: params.id,
      },
      data: {
        isFavorite,
      },
    })

    return NextResponse.json(updatedTranslation)
  } catch (error) {
    console.error("Error updating favorite status:", error)
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 })
  }
}