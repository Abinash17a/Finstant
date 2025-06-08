import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'





const urlMap = new Map<string, string>()
const baseURL = 'https://short.ly/' // Your domain
let idCounter = 1000 // Starting ID



const SECRET = process.env.JWT_SECRET || 'your-secret-key'
console.log("sectret in utils", SECRET)



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



export function getUserFromToken(req: any) {
  const authHeader = req.headers.get('authorization')
  if (!authHeader) return null
  console.log(authHeader, "authHeader in getUserFromToken")
  const token = authHeader.split(' ')[1]
  console.log("token in getUserFromToken", token)
  try {
    const payload = jwt.verify(token, SECRET) as { userId: string }
    console.log("payload in getUserFromToken", payload)
    return payload.userId
  } catch (err) {
    return null
  }
}

export const getUserFromauthToken = async (token: string) => {
  if (!token) return null
  const decoded = jwt.decode(token);
  if (decoded === null) {
    throw new Error("Invalid token format");
  }
  try {
    // const payload = jwt.verify(token, SECRET) as { userId: string }
    const decoded = jwt.decode(token);
    if (decoded && typeof decoded === 'object' && 'userId' in decoded) {
      return (decoded as { userId: string }).userId;
    }
    return null;
  } catch (err) {
    console.log("error occured in getUserFromauthToken", err)
    return null
  }
}

