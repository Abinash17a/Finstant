import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '../../../lib/prisma' // Adjust path as per your setup
import jwt from 'jsonwebtoken'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
    body,
  } = req

  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' })
  }

  let decodedToken: any
  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET as string)
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' })
  }

  if (decodedToken.id !== id) {
    return res.status(403).json({ message: 'Forbidden: User ID mismatch' })
  }

  switch (method) {
    case 'GET':
      try {
        const user = await prisma.user.findUnique({ where: { id: id as string } })
        if (!user) return res.status(404).json({ message: 'User not found' })
        return res.status(200).json(user)
      } catch (error) {
        return res.status(500).json({ message: 'Error fetching user', error })
      }

    case 'PUT':
      try {
        const updatedUser = await prisma.user.update({
          where: { id: id as string },
          data: body,
        })
        return res.status(200).json({ message: `Updated user with id: ${id}`, data: updatedUser })
      } catch (error) {
        return res.status(500).json({ message: 'Error updating user', error })
      }

    case 'DELETE':
      try {
        await prisma.user.delete({ where: { id: id as string } })
        return res.status(200).json({ message: `Deleted user with id: ${id}` })
      } catch (error) {
        return res.status(500).json({ message: 'Error deleting user', error })
      }

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE'])
      return res.status(405).end(`Method ${method} Not Allowed`)
  }
}
