"use client";
import React, { useState } from "react";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { FileUpload } from "@/components/ui/file-upload";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

export default function PurpleUploadPage() {
  const [file, setFile] = useState<File | null>(null); // Updated to File | null
  const [fileType, setFileType] = useState<string>(""); // Explicit string type
  const [redactionDegree, setRedactionDegree] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Updated to string | null
  const [customPrompt, setCustomPrompt] = useState<string>(""); // Explicit string type
  const [redactionMode, setRedactionMode] = useState("level"); // 'level' or 'custom'
  const [imagesRedacted, setImagesRedacted] = useState(false);
  const router = useRouter();

  const redactionDescriptions = [
    "Level 1: Basic redaction - Removes URLs, IDs and numerical personal information.",
    "Level 2: Moderate redaction - Removes URLs, IDs, numerical information and images.",
    "Level 3: High redaction - Removes all personal and sensitive data, including contextual information.",
    "Level 4: Maximum redaction - Removes all but essential information, leaving only the core message.",
  ];

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // Added React.FormEvent type
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileType", fileType);

    let response;
    try {
      if (redactionMode === "level") {
        formData.append("level", redactionDegree.toString());
        const slug = fileType === "pdf" ? "sensitive" : "redactimg";
        response = await axios.post(`http://127.0.0.1:5000/${slug}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        formData.append("prompt", customPrompt);
        response = await axios.post(
          "http://127.0.0.1:5000/customsens",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        localStorage.setItem("imagesRedacted", imagesRedacted ? "1" : "0");
      }

      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        let data = response.data;
        data.fileType = fileType;
        let cat = await axios.post("http://127.0.0.1:5000/getcat", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data.fileCategory = cat.data.category;
        const jsonData = JSON.stringify(data);
        const originalBlob = new Blob([file], { type: file.type }); // file has type File | null, so `file?.type` is safer
        const originalUrl = URL.createObjectURL(originalBlob);

        localStorage.setItem("originalFileUrl", originalUrl);
        localStorage.setItem("jsonData", jsonData);

        if (redactionMode === "level") {
          router.push(`/uploads/options?level=${redactionDegree}`);
        } else {
          router.push(`/preview?original=${encodeURIComponent(originalUrl)}`);
        }
      } else {
        throw new Error(
          `Received response is not a valid JSON. Content type: ${contentType}`
        );
      }
    } catch (error) {
      console.error("There was an error processing the file!", error);
      setError(
        "An error occurred while processing the file. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="absolute h-screen flex items-center justify-center">
        <TextHoverEffect text="Upload" />
      </div>
      <Card className="w-full max-w-md bg-transparent mt-6 z-20 shadow-xl border-purple-500 overflow-hidden">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-purple-800">
            Upload File
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-2"
              >
                <FileUpload onChange={handleFileChange} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <Label htmlFor="file-type" className="text-purple-700">
                  File Type
                </Label>
                <Select onValueChange={setFileType}>
                  <SelectTrigger
                    id="file-type"
                    className="bg-white dark:bg-black text-purple-600 border-purple-500 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <SelectValue placeholder="Select file type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="img">IMAGE</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-2"
              >
                <Label htmlFor="redaction-mode" className="text-purple-700">
                  Redaction Mode
                </Label>
                <Select onValueChange={setRedactionMode} value={redactionMode}>
                  <SelectTrigger
                    id="redaction-mode"
                    className="bg-white dark:bg-black text-purple-600 border-purple-500 focus:border-purple-500 focus:ring-purple-500"
                  >
                    <SelectValue placeholder="Select redaction mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="level">Redaction Level</SelectItem>
                    <SelectItem value="custom">Custom Redaction</SelectItem>
                  </SelectContent>
                </Select>
              </motion.div>
              {redactionMode === "level" ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <Label htmlFor="redaction-degree" className="text-purple-700">
                    Degree of Redaction (1-4)
                  </Label>
                  <Slider
                    id="redaction-degree"
                    min={1}
                    max={4}
                    step={1}
                    value={[redactionDegree]}
                    onValueChange={(value) => setRedactionDegree(value[0])}
                    className="w-full"
                  />
                  <div className="text-center text-purple-600">
                    {redactionDescriptions[redactionDegree - 1]}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="space-y-2"
                >
                  <Label htmlFor="custom-prompt" className="text-purple-700">
                    Custom Prompt
                  </Label>
                  <Input
                    id="custom-prompt"
                    placeholder="Enter custom redaction instructions"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 flex items-center space-x-2"
                  >
                    <Checkbox
                      id="images-redacted"
                      className="peer h-4 w-4 text-purple-600 border-purple-500 focus:ring-purple-500"
                      checked={imagesRedacted}
                      onCheckedChange={(checked: CheckedState) =>
                        setImagesRedacted(!!checked)
                      }
                    />
                    <label
                      htmlFor="images-redacted"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I want to Redact Images
                    </label>
                  </motion.div>
                </motion.div>
              )}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-red-500 text-center"
                >
                  {error}
                </motion.div>
              )}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? "Processing..." : "Upload"}
                </Button>
              </motion.div>
            </motion.form>
          </AnimatePresence>
        </CardContent>
        <CardFooter className="text-center">
          <span className="text-sm text-gray-500">
            Upload and redact sensitive information securely with VeilX.
          </span>
        </CardFooter>
      </Card>
    </div>
  );
}
