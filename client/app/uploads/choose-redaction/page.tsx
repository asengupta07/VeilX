"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

interface RedactionOption {
  id: string;
  label: string;
}

export default function ChooseRedactionPage() {
  const [options, setOptions] = useState<RedactionOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("/api/redactv2");
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching redaction options:", error);
        setError("Failed to load redaction options. Please try again.");
      }
    };

    fetchOptions();
  }, []);

  const handleOptionToggle = (optionId: string) => {
    setSelectedOptions((prev) =>
      prev.includes(optionId)
        ? prev.filter((id) => id !== optionId)
        : [...prev, optionId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedOptions.length === 0) {
      setError("Please select at least one option to redact.");
      return;
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/apply-redaction", {
        redactionOptions: selectedOptions,
      });

      console.log(response.data);

      router.push("/redaction-success");
    } catch (error) {
      console.error("Error applying redaction:", error);
      setError("An error occurred while applying redaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-gray-100 dark:bg-black transition-colors duration-200">
      <div className="absolute h-[90vh] flex items-center justify-center">
        <TextHoverEffect text="Redact" />
      </div>
      <Card className="w-full max-w-md bg-white dark:bg-transparent mt-6 z-20 shadow-xl border-purple-500 dark:border-purple-400 overflow-hidden transition-colors duration-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-purple-800 dark:text-purple-300">
            Choose Redaction Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {options.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={option.id}
                    checked={selectedOptions.includes(option.id)}
                    onCheckedChange={() => handleOptionToggle(option.id)}
                  />
                  <Label
                    htmlFor={option.id}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700 dark:text-gray-300"
                  >
                    {option.label}
                  </Label>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: options.length * 0.1 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
                  disabled={isLoading}
                >
                  {isLoading ? "Applying Redaction..." : "Apply Redaction"}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: options.length * 0.1 + 0.1 }}
                  className="text-red-500 dark:text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.form>
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-purple-600 dark:text-purple-400 text-center w-full">
            Secure redaction powered by VeilX
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
