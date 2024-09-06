"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

export default function PurpleUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>("");
  const [redactionDegree, setRedactionDegree] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
    formData.append("redactionDegree", redactionDegree.toString());
    const slug = fileType === "pdf" ? "sensitive" : "redactimg";

    try {
      const response = await axios.post(
        `http://127.0.0.1:5000/${slug}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const contentType = response.headers["content-type"];
      if (contentType && contentType.includes("application/json")) {
        const jsonData = JSON.stringify(response.data);
        const originalBlob = new Blob([file], { type: file.type });
        const originalUrl = URL.createObjectURL(originalBlob);

        // Store data in localStorage
        localStorage.setItem("originalFileUrl", originalUrl);
        localStorage.setItem("jsonData", jsonData);

        // Navigate to the next page without passing data via URL
        router.push(`/uploads/choose-redaction`);
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
                  className="py-4"
                />
                <div className="text-right text-sm text-purple-600">
                  Current value: {redactionDegree}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Upload and Preview"}
                </Button>
              </motion.div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-red-500 text-sm text-center"
                >
                  {error}
                </motion.div>
              )}
            </motion.form>
          </AnimatePresence>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-purple-600 text-center w-full">
            Secure file upload powered by VeilX
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
