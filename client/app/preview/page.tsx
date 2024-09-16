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
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "../contexts/authContext";
import axios from "axios";
import { upload } from "thirdweb/storage";
import { client } from "@/app/client";
import { MediaRenderer } from "thirdweb/react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";

export default function DocumentPreviewPage() {
  const { email } = useAuth();
  const { toast } = useToast();
  const { distributeReward, address } = useStateContext();
  const [originalFileUrl, setOriginalFileUrl] = useState<string | null>(null);
  const [redactedFileUrl, setRedactedFileUrl] = useState<string | null>(null);
  const [consentGiven, setConsentGiven] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state
  const searchParams = useSearchParams();
  const [ipfsUrl, setIpfsUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUrls = async () => {
      const originalUrl = searchParams.get("original");
      const redactedUrl = searchParams.get("redacted");

      if (originalUrl) setOriginalFileUrl(decodeURIComponent(originalUrl));
      if (redactedUrl) setRedactedFileUrl(decodeURIComponent(redactedUrl));
      else {
        const jsonData = localStorage.getItem("jsonData");
        if (jsonData) {
          try {
            const data = JSON.parse(jsonData);
            const response = await axios.post(
              "http://127.0.0.1:5000/customrv2",
              data,
              {
                headers: {
                  "Content-Type": "application/json",
                },
                responseType: "blob",
              }
            );

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            setRedactedFileUrl(url);
          } catch (error) {
            console.error("Error fetching redacted file:", error);
          }
        }
      }
    };

    fetchUrls();
  }, [searchParams]);

  const handleStoreOnBlockchain = async () => {
    console.log("Storing on blockchain...");
    if (originalFileUrl) {
      const response = await fetch(originalFileUrl);
      const blob = await response.blob();

      const file = new File([blob], "original_document.pdf", {
        type: blob.type,
      });
      const uri = await upload({
        client,
        files: [file],
      });

      console.log("URI:", uri);
      const data = JSON.parse(localStorage.getItem("jsonData") || "");
      const dbResponse = await fetch("/api/upload", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          fileUrl: uri,
          fileType: data.fileType,
          fileCategory: data.fileCategory,
        }),
      });
      setIpfsUrl(uri);
      if (dbResponse.ok) {
        toast({
          title: "Success!",
          description: "Stored document on InterPlanetary File System successfully.",
          action: (
            <ToastAction altText="Success"></ToastAction>
          ),
        })
      } else {
        toast({
          title: "Error!",
          description: "Failed to store document on IPFS.",
          action: (
            <ToastAction altText="Error"></ToastAction>
          ),
        })
      }
    }
  };

  const handleDownloadRedacted = () => {
    if (redactedFileUrl) {
      const link = document.createElement("a");
      link.href = redactedFileUrl;
      link.download = "redacted_document";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (localStorage.getItem("jsonData")) {
      // Handle case when no redacted file URL but jsonData is available
    }
  };

  const handleStoreInDatabase = async () => {
    setLoading(true); // Set loading to true when process starts
    const rand = (Math.random() * 0.09 + 0.01).toFixed(2); // Random amount between 0.01 and 0.1

    if (redactedFileUrl) {
      try {
        // Step 1: Distribute reward and get transaction hash
        const transactionHash = await distributeReward(address, rand);

        // Step 2: Fetch the redacted file blob from the URL
        const response = await fetch(redactedFileUrl);
        const blob = await response.blob();

        // Step 3: Create a File object to send with the form
        const file = new File([blob], "redacted_document.pdf", {
          type: blob.type,
        });

        // Step 4: Prepare the form data for the API call to /addtxn
        const formData = new FormData();
        formData.append("file", file);
        formData.append("txn", transactionHash);

        // Step 5: Make a POST request to the /addtxn API endpoint
        const apiResponse = await axios.post(
          "http://127.0.0.1:5000/addtxn",
          formData,
          {
            responseType: "blob",
          }
        );
        if (apiResponse.status === 200) {
          // Step 5: Create a new Blob object from the response
          const contentType = apiResponse.headers["content-type"];
          const newFileBlob = new Blob([apiResponse.data], { type: contentType });

          // Step 6: Create a new File object from the response
          const newFile = new File([newFileBlob], `hash_${file.name}`, {
            type: newFileBlob.type,
          });

        // Step 7: Upload the new file to Firebase Storage
        const storageRef = ref(storage, `documents/${newFile.name}${Date.now()}`);
        const snapshot = await uploadBytes(storageRef, newFile);
        const firebaseUrl = await getDownloadURL(snapshot.ref);

        // Step 8: Update the redacted file URL state
        setRedactedFileUrl(firebaseUrl);

        // Step 9: Save the Firebase URL to the database
        const data = JSON.parse(localStorage.getItem("jsonData") || "");
        const dbResponse = await fetch("/api/upload", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            fileUrl: firebaseUrl,
            fileType: data.fileType,
            fileCategory: data.fileCategory,
            transactionHash: transactionHash,
          }),
        });

        if (dbResponse.ok) {
          toast({
            title: "Success!",
            description: "Stored document in the database successfully.",
            action: (
              <ToastAction altText="Success"></ToastAction>
            ),
          })
        } else {
          toast({
            title: "Error!",
            description: "Failed to store document in the database.",
            action: (
              <ToastAction altText="Error"></ToastAction>
            ),
          })
        }
      }
     } finally {
        setLoading(false); // Set loading to false after process ends
      }
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
              {ipfsUrl && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <Label className="text-lg font-semibold text-purple-700">
                    Stored Document
                  </Label>
                  <MediaRenderer client={client} src={ipfsUrl} />
                </motion.div>
              )}
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
                    disabled={!consentGiven || loading} // Disable when loading
                  >
                    {loading ? (
                      <span className="loader"></span> // Loader indicator (replace with your preferred loader)
                    ) : (
                      "Store on Our Secure Database"
                    )}
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
