import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function getUserFromToken(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string }
    return payload.userId
  } catch (err) {
    return null
  }
}



Now you can use this in any API route to fetch user data:

const userId = getUserFromToken(req)
const user = await prisma.user.findUnique({ where: { id: userId } })