"use client";

import React, { useState, useEffect } from "react";
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
import { useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SensitiveInfo {
  end: number;
  start: number;
  text: string;
  type: string;
}

interface RedactionOption {
  id: string;
  label: string;
  text: string;
}

export default function ChooseRedactionPage() {
  const [options, setOptions] = useState<RedactionOption[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<{
    doc: string;
    sensitive: SensitiveInfo[];
    annotated_pdf: string;
  } | null>(null);
  const [annotatedPdfUrl, setAnnotatedPdfUrl] = useState<string | null>(null);
  const [annotatedBlobUrl, setAnnotatedBlobUrl] = useState<string | null>(null);
  const [redactedBlobUrl, setRedactedBlobUrl] = useState<string | null>(null);
  const [level, setLevel] = useState<string>("");
  const [mode, setMode] = useState<string>("black");
  const router = useRouter();

  useEffect(() => {
    const storedOriginalUrl = localStorage.getItem("originalFileUrl");
    const storedJsonData = localStorage.getItem("jsonData");
    const storedlevel = new URLSearchParams(window.location.search).get(
      "level"
    );
    if (storedOriginalUrl) {
      setOriginalFileUrl(storedOriginalUrl);
    }
    if (storedlevel) {
      setLevel(storedlevel);
      console.log(storedlevel);
    }

    if (storedJsonData) {
      try {
        const parsedData = JSON.parse(storedJsonData);
        setJsonData(parsedData);
        setAnnotatedPdfUrl(parsedData.annotated_pdf);
        const redactionOptions: RedactionOption[] = parsedData.sensitive.map(
          (item: { type: any; text: any }, index: number) => ({
            id: `option-${index}`,
            label: item.type,
            text: item.text,
          })
        );
        setOptions(redactionOptions);
      } catch (error) {
        console.error("Error decoding or parsing JSON data:", error);
        setError("Failed to load redaction options. Please try again.");
      }
    }
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
      const selectedTexts = selectedOptions.map(
        (optionId) => options.find((option) => option.id === optionId)?.text
      );

      const filteredSensitiveInfo = jsonData?.sensitive.filter((item) =>
        selectedTexts.includes(item.text)
      );
      console.log(filteredSensitiveInfo);
      const response = await axios.post(
        "http://127.0.0.1:5000/redactv2",
        {
          doc: jsonData?.doc,
          sensitive: filteredSensitiveInfo,
          level,
          mode,
        },
        {
          responseType: "blob",
        }
      );

      const contentType = response.headers["content-type"];
      const redactedBlob = new Blob([response.data], { type: contentType });

      if (originalFileUrl) {
        const originalBlob = await fetch(originalFileUrl).then((res) =>
          res.blob()
        );

        const originalBlobUrl = URL.createObjectURL(originalBlob);
        const redactedBlobUrl = URL.createObjectURL(redactedBlob);

        setOriginalFileUrl(originalBlobUrl);
        setRedactedBlobUrl(redactedBlobUrl);

        router.push(
          `/preview?original=${encodeURIComponent(
            originalBlobUrl
          )}&redacted=${encodeURIComponent(redactedBlobUrl)}`
        );
      }
    } catch (error) {
      console.error("Error applying redaction:", error);
      setError("An error occurred while applying redaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenderAnnotatedPdf = async () => {
    if (annotatedPdfUrl) {
      try {
        const filename = annotatedPdfUrl.split("/").pop();
        const response = await axios.get(
          `http://127.0.0.1:5000/download_annotated/${filename}`,
          {
            responseType: "blob",
          }
        );
        const contentType = response.headers["content-type"];
        const blob = new Blob([response.data], { type: contentType });
        const url = URL.createObjectURL(blob);
        setAnnotatedBlobUrl(url);
      } catch (error) {
        console.error("Error rendering annotated PDF:", error);
        setError("Failed to render annotated PDF. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-gray-100 dark:bg-black transition-colors duration-200">
      <div className="absolute h-[90vh] flex items-center justify-center">
        <TextHoverEffect text="Redact" />
      </div>
      <Card className="w-full max-w-4xl bg-white dark:bg-transparent mt-6 z-20 shadow-xl border-purple-500 dark:border-purple-400 overflow-hidden transition-colors duration-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-purple-800 dark:text-purple-300">
            Choose Redaction Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            {originalFileUrl && (
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-2">Original File:</h3>
                {originalFileUrl.includes("image") ? (
                  <img
                    src={originalFileUrl}
                    alt="Original file"
                    className="max-w-full h-auto"
                  />
                ) : (
                  <iframe
                    src={originalFileUrl}
                    className="w-full h-64 border-2 border-purple-500"
                  ></iframe>
                )}
              </div>
            )}
            {annotatedBlobUrl && (
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-2">Annotated File:</h3>
                <iframe
                  src={annotatedBlobUrl}
                  className="w-full h-64 border-2 border-purple-500"
                ></iframe>
              </div>
            )}
          </div>
          <AnimatePresence mode="wait">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit}
              className="space-y-4 mt-4"
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
                    {option.label}: {option.text}
                  </Label>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: options.length * 0.1 }}
              >
                <Label
                  htmlFor="mode"
                  className="text-sm font-medium mb-2 block"
                >
                  Redaction Mode
                </Label>
                <Select value={mode} onValueChange={(value) => setMode(value)}>
                  <SelectTrigger id="mode">
                    <SelectValue placeholder="Select redaction mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="white">White</SelectItem>
                    <SelectItem value="blur">Blur</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: options.length * 0.1 + 0.1 }}
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
                  transition={{ delay: options.length * 0.1 + 0.2 }}
                  className="text-red-500 dark:text-red-400 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.form>
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <Button
            onClick={handleRenderAnnotatedPdf}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
          >
            Render Annotated PDF
          </Button>
          <p className="text-sm text-purple-600 dark:text-purple-400 text-center w-full">
            Secure redaction powered by VeilX
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
