"use client"

import type React from "react"

// src/components/auth/EmailLogin.tsx
import { Eye, Mail, Lock ,EyeOff} from "lucide-react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
// import { useAppDispatch } from '@/hooks/reduxHooks'
// import { login } from '@/features/auth/authSlice'


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function EmailLogin({ onForgotPassword }: { onForgotPassword: () => any }) {
  const navigate = useNavigate()
  //const dispatch = useAppDispatch()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!email || !password) {
      toast.error("Please fill in both fields")
      return
    }
  
  //   try {
  //     await dispatch(login({ username: email, password })).unwrap()
  //     toast.success("Logged in successfully!")
  //     navigate("/dashboard")
  //   // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //   } catch (error: any) {
  //     toast.error(error || "Login failed. Please try again.")
  //   }

  // }

  try {
    // ✅ FUTURE: Replace this block with API call
    // const res = await axios.post("/api/login", { email, password });
    // const { user, token } = res.data;

    const mockUser = {
      id: "12345", // Mock ID added
      name: "John Doe",
      email,
      role: "Admin",
    }

    const mockToken = "fake-jwt-token" // ✅ Replace with real token from backend

    // ✅ Save to Redux
    //dispatch(setUser({ user: mockUser, token: mockToken }))

    // ✅ Save to LocalStorage
    localStorage.setItem("auth", JSON.stringify({ user: mockUser, token: mockToken }))

    toast.success("Logged in successfully!")
    navigate("/dashboard")
  } catch {
    toast.error("Login failed. Please try again.")
  }
}
  return (
    <>
      <form className="space-y-6" onSubmit={handleLogin}>
        <div className="space-y-2">
          <label htmlFor="email" className="block text-md text-muted-foreground mb-2">
            Email
          </label>
          <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Mail className="h-5 w-5 text-black" />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-12 py-6 bg-input border-none"
          />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-md text-muted-foreground">
            Password
          </label>
          <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <Lock className="h-5 w-5 text-black" />
          </div>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-12 py-6 border-none bg-input"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="text-right">
        <p className="text-right text-sm mt-2">
          <button
            type="button"
            className="text-accent hover:underline"
            onClick={onForgotPassword}
          >
            Forget Password?
          </button>
        </p>
        </div>

        <Button className="w-full py-6 bg-primary hover:bg-primary/90 text-primary-foreground text-lg font-medium rounded-xl" type="submit">
          Login
        </Button>
      </form>
    </>
  )
}
