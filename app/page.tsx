'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { jwtDecode } from 'jwt-decode'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.replace('/landing')
      return
    }

    try {
      // Optional: decode to check expiration or structure
      const decoded: any = jwtDecode(token)

      const isExpired =
        decoded.exp && Date.now() >= decoded.exp * 1000

      if (isExpired) {
        localStorage.removeItem('token')
        router.replace('/landing')
      } else {
        router.replace('/dashboard')
      }
    } catch (error) {
      localStorage.removeItem('token')
      router.replace('/landing')
    }
  }, [router])

  return null
}
