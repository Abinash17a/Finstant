import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import jwt from 'jsonwebtoken'
import axios from 'axios';




const SECRET = process.env.JWT_SECRET || 'your-secret-key'
// console.log("sectret in utils", SECRET)



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

export function formatWord(input:any) {
  return input
    ?.toLowerCase()
    .split('_')
    .map((word: any) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export async function getHuggingFaceAdvice(prompt: string) {
  const HUGGING_FACE_API_TOKEN = process.env.HUGGINGFACE_API_KEY;

  const res = await axios.post(
    'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.3',
    {
      inputs: prompt,
      parameters: {
        temperature: 0.8,
        top_p: 0.95,
        max_new_tokens: 200,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${HUGGING_FACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    }
  );

  // return res.data?.[0]?.generated_text || 'No advice available.';
  console.log("hello",res.data?.[0]?.generated_text)
  const result = await extractSavingTip(res.data?.[0]?.generated_text)
  return result || 'No advice available.';
}


export async function extractSavingTip(advice: string) {
  console.log(advice, "advice in extractSavingTip")
  const firstQuoteIndex = advice.indexOf('"');
  if (firstQuoteIndex === -1) return 'No tip found.';

  const actualAdvice = advice.slice(firstQuoteIndex + 1).trim();
  const sentences = actualAdvice.split(/[.!?]\s+/);
  if (sentences.length < 2) return 'No tip found.';

  return sentences.slice(1).join('. ') + '.';
}