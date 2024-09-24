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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
  type: string;
}

interface GroupedOptions {
  [key: string]: RedactionOption[];
}

export default function ChooseRedactionPage() {
  const [groupedOptions, setGroupedOptions] = useState<GroupedOptions>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [jsonData, setJsonData] = useState<{
    doc: string;
    sensitive: SensitiveInfo[];
    annotated_pdf: string;
  } | null>(null);
  const [annotatedBlobUrl, setAnnotatedBlobUrl] = useState<string | null>(null);
  const [level, setLevel] = useState<string>("");
  const [mode, setMode] = useState<string>("black");
  const router = useRouter();

  useEffect(() => {
    const storedOriginalUrl = localStorage.getItem("originalFileUrl");
    const storedJsonData = localStorage.getItem("jsonData");
    const storedLevel = new URLSearchParams(window.location.search).get(
      "level"
    );

    if (storedOriginalUrl) setOriginalFileUrl(storedOriginalUrl);
    if (storedLevel) setLevel(storedLevel);

    if (storedJsonData) {
      try {
        const parsedData = JSON.parse(storedJsonData);
        setJsonData(parsedData);
        const redactionOptions: RedactionOption[] = parsedData.sensitive.map(
          (item: SensitiveInfo, index: number) => ({
            id: `option-${index}`,
            label: item.type,
            text: item.text,
            type: item.type,
          })
        );

        const grouped = redactionOptions.reduce((acc, option) => {
          if (!acc[option.type]) acc[option.type] = [];
          acc[option.type].push(option);
          return acc;
        }, {} as GroupedOptions);

        setGroupedOptions(grouped);
        if (parsedData.annotated_pdf)
          renderAnnotatedPdf(parsedData.annotated_pdf);
        else renderAnnotatedPdf(parsedData.annotated_img);
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

  const handleTypeToggle = (type: string) => {
    const typeOptions = groupedOptions[type].map((option) => option.id);
    const allSelected = typeOptions.every((id) => selectedOptions.includes(id));

    if (allSelected) {
      setSelectedOptions((prev) =>
        prev.filter((id) => !typeOptions.includes(id))
      );
    } else {
      setSelectedOptions((prev) => {
        const newSelection = new Set(prev);
        typeOptions.forEach((id) => newSelection.add(id));
        return Array.from(newSelection);
      });
    }
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
      const selectedTexts = selectedOptions.flatMap((optionId) => {
        const option = Object.values(groupedOptions)
          .flat()
          .find((opt) => opt.id === optionId);
        return option ? option.text : [];
      });

      const filteredSensitiveInfo = jsonData?.sensitive.filter((item) =>
        selectedTexts.includes(item.text)
      );

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

  const renderAnnotatedPdf = async (filename: string) => {
    console.log("Annotated PDF Filename:", filename);
    try {
      const response = await axios.get(`http://127.0.0.1:5000${filename}`, {
        responseType: "blob",
      });
      const contentType = response.headers["content-type"];
      const blob = new Blob([response.data], { type: contentType });
      const url = URL.createObjectURL(blob);
      console.log("Annotated PDF Blob URL:", url);
      setAnnotatedBlobUrl(url);
      console.log("Annotated PDF URL:", url);
    } catch (error) {
      console.error("Error rendering annotated PDF:", error);
      setError("Failed to render annotated PDF. Please try again.");
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
          <div className="flex space-x-4 mb-4">
            {originalFileUrl && (
              <div className="w-1/2">
                <h3 className="text-lg font-semibold mb-2">Original File:</h3>
                {originalFileUrl.includes("arnabkimummy") ? (
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
              className="space-y-4"
            >
              <Accordion type="multiple" className="w-full">
                {Object.entries(groupedOptions).map(
                  ([type, options], index) => (
                    <AccordionItem value={type} key={type}>
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id={`type-${type}`}
                            checked={options.every((option) =>
                              selectedOptions.includes(option.id)
                            )}
                            onCheckedChange={() => handleTypeToggle(type)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Label htmlFor={`type-${type}`}>{type}</Label>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pl-6 space-y-2">
                          {options.map((option) => (
                            <div
                              key={option.id}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={option.id}
                                checked={selectedOptions.includes(option.id)}
                                onCheckedChange={() =>
                                  handleOptionToggle(option.id)
                                }
                              />
                              <Label htmlFor={option.id}>{option.text}</Label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )
                )}
              </Accordion>

              <div>
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
              </div>

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white dark:bg-purple-700 dark:hover:bg-purple-600"
                disabled={isLoading}
              >
                {isLoading ? "Applying Redaction..." : "Apply Redaction"}
              </Button>

              {error && (
                <div className="text-red-500 dark:text-red-400 text-sm text-center">
                  {error}
                </div>
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
