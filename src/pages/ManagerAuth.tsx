import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { UtensilsCrossed, Mail, Lock, User } from "lucide-react";

interface FormFields {
  email: string;
  password: string;
  rememberMe?: boolean;
  name?: string;
  confirmPassword?: string;
}

const ManagerAuth: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormFields>({
    email: "",
    password: "",
    rememberMe: true,
    name: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("All fields are required");
      return false;
    }

    if (authMode === "signup") {
      if (!formData.name) {
        setError("Name is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords don't match");
        return false;
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters long");
        return false;
      }
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // For demo purposes, always succeed with hardcoded credentials
      // In a real app, this would be a real authentication API call
      if (authMode === "login" && formData.email === "admin@restaurant.com" && formData.password === "password") {
        localStorage.setItem("manager_logged_in", "true");
        navigate("/manager");
      } else if (authMode === "login") {
        setError("Invalid email or password");
      } else {
        // Sign up success
        localStorage.setItem("manager_logged_in", "true");
        localStorage.setItem("manager_name", formData.name || "");
        localStorage.setItem("manager_email", formData.email);
        navigate("/manager");
      }
    } catch (error) {
      setError("Authentication failed. Please try again.");
      console.error("Auth error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="backdrop-blur-xl bg-white/10 border-white/20 shadow-xl">
          <CardHeader className="text-center text-white space-y-2">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-2">
              <UtensilsCrossed className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-semibold">
              Restaurant Manager
            </CardTitle>
            <CardDescription className="text-gray-200">
              {authMode === "login"
                ? "Sign in to access your dashboard"
                : "Create a new manager account"}
            </CardDescription>
          </CardHeader>
          <Tabs
            value={authMode}
            onValueChange={(value) => {
              setAuthMode(value as "login" | "signup");
              setError("");
            }}
            className="w-full"
          >
            <div className="px-6">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="pt-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-white px-4 py-2 rounded-md mb-4 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <TabsContent value="login" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="manager@restaurant.com"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password" className="text-white">
                        Password
                      </Label>
                      <a
                        href="#"
                        className="text-sm text-primary hover:underline"
                      >
                        Forgot?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData((prev) => ({
                          ...prev,
                          rememberMe: !!checked,
                        }))
                      }
                    />
                    <label
                      htmlFor="rememberMe"
                      className="text-sm font-medium text-gray-300 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me for 30 days
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="signup" className="mt-0 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Smith"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        autoComplete="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-white">
                      Email
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signupEmail"
                        name="email"
                        type="email"
                        placeholder="manager@restaurant.com"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-white">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="signupPassword"
                        name="password"
                        type="password"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                        autoComplete="new-password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </TabsContent>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>
                        {authMode === "login"
                          ? "Signing In..."
                          : "Creating Account..."}
                      </span>
                    </div>
                  ) : authMode === "login" ? (
                    "Sign In"
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </CardContent>
          </Tabs>

          <CardFooter className="border-t border-white/10 text-center pt-4 pb-6">
            <p className="text-gray-300 text-sm w-full">
              By continuing, you agree to our{" "}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ManagerAuth;
