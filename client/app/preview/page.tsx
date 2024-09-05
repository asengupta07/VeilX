"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { useSearchParams } from "next/navigation";
import { useStateContext } from "../contexts/StateContext";

export default function DocumentPreviewPage() {
  const { distributeReward, address } = useStateContext();
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [redactedFileUrl, setRedactedFileUrl] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [randomAmount, setRandomAmount] = useState<string>("");
  const searchParams = useSearchParams();

  useEffect(() => {
    const originalUrl = searchParams.get("original");
    const redactedUrl = searchParams.get("redacted");
    if (originalUrl) setOriginalFileUrl(decodeURIComponent(originalUrl));
    if (redactedUrl) setRedactedFileUrl(decodeURIComponent(redactedUrl));
  }, [searchParams]);

  const handleStoreOnBlockchain = () => {
    // Implement blockchain storage logic here
    console.log("Storing on blockchain...");
  };

  const handleDownloadRedacted = () => {
    if (redactedFileUrl) {
      const link = document.createElement("a");
      link.href = redactedFileUrl;
      link.download = "redacted_document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleStoreInDatabase = () => {
    const rand = (Math.random() * 0.09 + 0.01).toFixed(2); // Random amount between 0.01 and 0.1
    setRandomAmount(rand);
    if (consentGiven) {
      console.log("Storing in secure database...");
      distributeReward(address, rand);
    } else {
      alert("Please give consent before storing in the database.");
    }
  };

  const renderPreview = (url: string | null, label: string) => {
    if (!url)
      return <p className="text-gray-500">{label} preview not available</p>;

    if (url.includes("application/pdf")) {
      return (
        <iframe
          src={url}
          title={`${label} Preview`}
          className="w-full h-full"
        />
      );
    } else {
      return (
        <iframe
          src={url}
          title={`${label} Document`}
          className="w-full h-full object-contain"
        />
      );
    }
  };

  return (
    <div className="min-h-screen flex flex-col pt-16">
      <div className="flex-grow flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <TextHoverEffect text="Document" />
        </div>
        <Card className="w-full max-w-6xl bg-transparent z-20 shadow-xl border-purple-500 overflow-hidden">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-purple-800">
              Document Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-purple-700">
                  Original Document
                </Label>
                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {renderPreview(originalFileUrl, "Original")}
                </div>
                <Button
                  onClick={handleStoreOnBlockchain}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Store Securely on Blockchain
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-4"
              >
                <Label className="text-lg font-semibold text-purple-700">
                  Redacted Document
                </Label>
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {renderPreview(redactedFileUrl, "Redacted")}
                </div>
                <div className="space-y-2">
                  <Button
                    onClick={handleDownloadRedacted}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Download Redacted File
                  </Button>
                  <Button
                    onClick={handleStoreInDatabase}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    disabled={!consentGiven}
                  >
                    Store on Our Secure Database
                  </Button>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex items-center space-x-2"
            >
              <Checkbox
                id="consent"
                checked={consentGiven}
                onCheckedChange={(checked: CheckedState) =>
                  setConsentGiven(!!checked)
                }
              />
              <label
                htmlFor="consent"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I consent to storing this document in the secure database
              </label>
            </motion.div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-purple-600 text-center w-full">
              Secure document redaction powered by VeilX
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
