import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
import { NextRequest } from "next/server"



const SECRET = process.env.JWT_SECRET || 'your-secret-key'



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



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

export function getUserFromauthToken(token: string) {
  console.log("Im here")
  console.log("token", token)
  // const authHeader = req.headers.get('authorization')
  if (!token) return null

  // const token = authHeader.split(' ')[1]
  console.log("Im here")
  try {
    console.log(token, "token in getUserFromauthToken", SECRET)
    const payload = jwt.verify(token, SECRET) as { userId: string }
    console.log("payload-------------",payload)
    return payload.userId
  } catch (err) {
    console.log("error occured in getUserFromauthToken", err)
    return null
  }
}