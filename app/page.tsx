// app/page.tsx
import { redirect } from "next/navigation"

export default function RootPage() {
  const auth = process.env.NEXT_PUBLIC_AUTH
  if (auth === "2") {
    redirect("/landing")
  } else {
    redirect("/dashboard")
  }
}
