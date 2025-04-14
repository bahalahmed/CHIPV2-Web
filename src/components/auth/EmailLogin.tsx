// src/components/auth/EmailLogin.tsx
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/features/auth/authSlice";

export default function EmailLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill in both fields");
      return;
    }
    try {
      // ✅ FUTURE: Replace this block with API call
      // const res = await axios.post("/api/login", { email, password });
      // const { user, token } = res.data;

      const mockUser = {
        id: "12345", // Mock ID added
        name: "John Doe",
        email,
        role: "Admin",
      };

      const mockToken = "fake-jwt-token"; // ✅ Replace with real token from backend

      // ✅ Save to Redux
      dispatch(setUser({ user: mockUser, token: mockToken }));

      // ✅ Save to LocalStorage
      localStorage.setItem("auth", JSON.stringify({ user: mockUser, token: mockToken }));

      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  return (
    <><form className="space-y-6" onSubmit={handleLogin}>
      <div className="space-y-2">
        <label htmlFor="email" className="text-[var(--text-muted)] block">Email</label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-[var(--bg-input)]" />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="text-[var(--text-muted)] block">Password</label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[var(--bg-input)] pr-10" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b8b8b]"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-[var(--accent)] hover:underline text-sm"
          onClick={() => navigate("/forgot-password")}
        >
          Forget Password?
        </button>
      </div>

      <Button className="w-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-[var(--white)]" type="submit">Login</Button>

    </form>
    </>
  );
}


