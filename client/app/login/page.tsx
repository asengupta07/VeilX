"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/app/contexts/authContext";
import { useRouter } from "next/navigation";

export default function AnimatedLoginSignup() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loginType, setLoginType] = useState("email");
  const { login } = useAuth();
  // State for form fields
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    login: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = isLogin
      ? { identifier: formData.login, password: formData.password }
      : {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        };

    const endpoint = isLogin ? "/api/login" : "/api/signup";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Success:", result);
        login(result.token, result.email, result.username);
        //redirect to home page
        router.push("/");
      } else {
        const error = await response.json();
        console.error("Error:", error);
        // Handle error (e.g., show an error message)
      }
    } catch (err) {
      console.error("Request failed:", err);
      // Handle network or other errors
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute h-screen flex items-center justify-center">
        <TextHoverEffect text="VeilX" />
      </div>
      <Card className="w-full max-w-md bg-transparent z-20 shadow-xl backdrop-blur-none overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-purple-800">
            {isLogin ? "Login" : "Sign Up"}
          </CardTitle>
          <CardDescription className="text-center text-purple-600">
            {isLogin
              ? "Enter your credentials to login"
              : "Create an account to get started"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? "login" : "signup"}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
            >
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-purple-700">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="dark:bg-black bg-white"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 mt-4"
                >
                  <Label htmlFor="username" className="text-purple-700">
                    Username
                  </Label>
                  <Input
                    id="username"
                    required
                    className="dark:bg-black bg-white"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-2"
                >
                  <Label className="text-purple-700">Login with</Label>
                  <RadioGroup
                    defaultValue="email"
                    className="flex space-x-4"
                    onValueChange={(value) => setLoginType(value)}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="email" id="email-radio" />
                      <Label htmlFor="email-radio" className="text-purple-700">
                        Email
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="username" id="username-radio" />
                      <Label
                        htmlFor="username-radio"
                        className="text-purple-700"
                      >
                        Username
                      </Label>
                    </div>
                  </RadioGroup>
                </motion.div>
              )}
              {isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2 mt-4"
                >
                  <Label htmlFor="login" className="text-purple-700">
                    {loginType === "email" ? "Email" : "Username"}
                  </Label>
                  <Input
                    id="login"
                    type={loginType === "email" ? "email" : "text"}
                    required
                    className="dark:bg-black bg-white"
                    value={formData.login}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2 mt-4"
              >
                <Label htmlFor="password" className="text-purple-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  className="dark:bg-black bg-white"
                  value={formData.password}
                  onChange={handleChange}
                />
              </motion.div>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 mt-4"
                >
                  <Label htmlFor="confirmPassword" className="text-purple-700">
                    Confirm Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    required
                    className="dark:bg-black bg-white"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  type="submit"
                  className="w-full mt-6 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLogin ? "Login" : "Sign Up"}
                </Button>
              </motion.div>
            </motion.form>
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Button
            variant="link"
            className="w-full text-purple-600 hover:text-purple-800"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
