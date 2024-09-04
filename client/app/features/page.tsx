import Link from "next/link";
import { TracingBeam } from "@/components/ui/tracing-beam";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Github,
} from "lucide-react";

export default function Component() {
  return (
    <>
      <TracingBeam>
        <header className="flex flex-col py-5 mt-5">
          <h1 className="text-6xl font-bold text-center mb-4">
            <span className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              VeilX
            </span>{" "}
            Features
          </h1>
          <p className="text-xl text-center text-muted-foreground">
            Secure document redaction powered by AI
          </p>
        </header>
        <div></div>
        <div className="flex flex-col min-h-screen pt-24">
          <main className="flex-1">
            <section className="bg-muted/40 py-16 md:py-28 lg:py-40">
              <div className="container px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6 mt-5">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                      Redact with Confidence
                    </h1>
                    <p className="max-w-lg text-muted-foreground text-lg md:text-xl lg:text-0.5xl">
                      Effortlessly redact sensitive information from any
                      document, image, or file with VeilX’s powerful redaction
                      tools.
                    </p>
                  </div>
                  <div className="grid gap-6">
                    <div className="bg-background rounded-lg p-6 shadow-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Document Redaction
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <FileIcon className="w-10 h-10" />
                          <span className="text-sm">Upload</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <PencilIcon className="w-10 h-10" />
                          <span className="text-sm">Redact</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <DownloadIcon className="w-10 h-10" />
                          <span className="text-sm">Download</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <SaveIcon className="w-10 h-10" />
                          <span className="text-sm">Save</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-6 shadow-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Storage Options
                      </h3>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <DatabaseIcon className="w-10 h-10" />
                          <span className="text-sm">VeilX Database</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <CoinsIcon className="w-10 h-10" />
                          <span className="text-sm">Blockchain</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-background py-16 md:py-28 lg:py-40">
              <div className="container px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6">
                    <div className="mt-8">
                      <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                        Secure Document Storage
                      </h2>
                      <p className="max-w-lg text-muted-foreground text-lg md:text-xl lg:text-0.5xl mt-5">
                        Choose where to store your redacted documents - in
                        VeilX’s secure database or on the blockchain. Maintain
                        full control over your sensitive data.
                      </p>
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link
                        href="#"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Learn More
                      </Link>
                      <Link
                        href="/uploads"
                        className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Try It Now
                      </Link>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col items-center gap-4 bg-background rounded-lg p-6 shadow-lg shadow-gray-800">
                        <DatabaseIcon className="w-10 h-10" />
                        <h3 className="text-xl font-semibold">
                          VeilX Database
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Store your redacted documents in VeilX’s secure
                          database.
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-4 bg-background rounded-lg p-6 shadow-lg shadow-gray-800">
                        <CoinsIcon className="w-10 h-10" />
                        <h3 className="text-xl font-semibold mr-5">
                          Blockchain
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Store your redacted documents on the blockchain for
                          maximum security.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col items-center gap-4 bg-background rounded-lg p-6 shadow-lg shadow-gray-800">
                        <WalletIcon className="w-10 h-10" />
                        <h3 className="text-xl font-semibold">
                          Connect Wallet
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your digital wallet to store documents on the
                          blockchain.
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-4 bg-background rounded-lg p-6 shadow-lg shadow-gray-800">
                        <StoreIcon className="w-10 h-10" />
                        <h3 className="text-xl font-semibold">
                          Choose Storage
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Select the storage option that best suits your needs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="bg-muted/40 py-16 md:py-28 lg:py-40">
              <div className="container px-4 md:px-6">
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                      Powerful Redaction Tools
                    </h2>
                    <p className="max-w-lg text-muted-foreground text-lg md:text-xl lg:text-0.5xl">
                      VeilX’s advanced redaction tools allow you to quickly and
                      easily remove sensitive information from any document,
                      image, or file.
                    </p>
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <Link
                        href="#"
                        className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Explore Features
                      </Link>
                      <Link
                        href="/uploads"
                        className="inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Start Free Trial
                      </Link>
                    </div>
                  </div>
                  <div className="grid gap-6">
                    <div className="bg-background rounded-lg p-6 shadow-lg">
                      <h3 className="text-xl font-semibold mb-4">
                        Redaction in Action
                      </h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        <div className="flex flex-col items-center gap-2">
                          <FileIcon className="w-10 h-10" />
                          <span className="text-sm">Upload</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <PencilIcon className="w-10 h-10" />
                          <span className="text-sm">Redact</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <DownloadIcon className="w-10 h-10" />
                          <span className="text-sm">Download</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <SaveIcon className="w-10 h-10" />
                          <span className="text-sm">Save</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-background rounded-lg p-4 shadow-sm">
                      <h3 className="text-xl font-semibold mb-4 ml-2">
                        Supported File Types
                      </h3>
                      <div className="grid grid-cols-4 gap-4 mt-4">
                        <div className="flex flex-col items-center gap-2">
                          <FileIcon className="w-8 h-8" />
                          <span className="text-sm">PDF</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <FileIcon className="w-8 h-8" />
                          <span className="text-sm">DOC</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <FileIcon className="w-8 h-8" />
                          <span className="text-sm">JPG</span>
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <FileIcon className="w-8 h-8" />
                          <span className="text-sm">PNG</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <section className="py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                      Marketplace for Redacted Documents
                    </h2>
                    <p className="max-w-lg text-muted-foreground text-lg md:text-xl lg:text-0.5xl mt-5">
                      Earn tokens by allowing your redacted documents to be
                      listed in our secure marketplace. You have full control
                      over whether your documents are available for sale.
                    </p>
                    <div className="flex flex-col gap-2 min-[400px]:flex-row">
                      <Link
                        href="#"
                        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Learn More
                      </Link>
                      <Link
                        href="#"
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                        prefetch={false}
                      >
                        Start Earning Tokens
                      </Link>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="bg-background rounded-lg p-4 mt-2 shadow-lg shadow-gray-800">
                      <div className="flex flex-col justify-center items-center h-full">
                        <h3 className="text-2xl font-semibold mb-4">
                          How the Marketplace Works
                        </h3>
                        <div className="grid grid-cols-4 gap-4 mt-4">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <UploadIcon className="w-8 h-8" />
                            <span className="text-sm ml-3">
                              Upload Document
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ToggleRightIcon className="w-8 h-8" />
                            <span className="text-sm ml-3">Choose Listing</span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-2">
                            <CoinsIcon className="w-8 h-8 mr-3" />
                            <span className="text-sm ml-4">Earn Tokens</span>
                          </div>
                          <div className="flex flex-col items-center justify-center gap-2 mb-3 mr-5">
                            <StoreIcon className="w-8 h-8" />
                            <span className="text-sm">Sell</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </TracingBeam>
      <footer className="space-y-8 bg-custom-gray-transparent">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="mb-8 md:mb-0">
              <h2 className="text-2xl font-bold text-primary mb-4">
              <span className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              VeilX
            </span>
              </h2>
              <p className="max-w-lg text-muted-foreground text-lg">
                Creating amazing experiences for our customers since 2024.
              </p>
            </div>
            <div className="ml-8">
              <h3 className="text-lg font-semibold mb-4">
                Quick Links
              </h3>
              <ul className="space-y-2 max-w-lg text-muted-foreground text-lg">
                <li>
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors "
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-primary transition-colors "
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/services"
                    className="hover:text-primary transition-colors "
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-primary transition-colors "
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Legal
              </h3>
              <ul className="space-y-2 max-w-lg text-muted-foreground text-lg">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-primary transition-colors "
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-primary transition-colors "
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="hover:text-primary transition-colors "
                  >
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 ml-1 ">
                Follow Us
              </h3>
              <div className="flex space-x-4 max-w-lg text-muted-foreground text-lg">
                <Link
                  href="https://facebook.com"
                  className="hover:text-primary transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link
                  href="https://twitter.com"
                  className="hover:text-primary transition-colors"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link
                  href="https://instagram.com"
                  className="hover:text-primary transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link
                  href="https://linkedin.com"
                  className="hover:text-primary transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
                <Link
                  href="https://youtube.com"
                  className="hover:text-primary transition-colors"
                >
                  <Youtube className="h-6 w-6" />
                  <span className="sr-only">YouTube</span>
                </Link>
                <Link
                  href="https://github.com"
                  className="hover:text-primary transition-colors"
                >
                  <Github className="h-6 w-6" />
                  <span className="sr-only">GitHub</span>
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-muted-foreground/20 mt-8 pt-8 text-center ">
          <span className="max-w-lg text-muted-foreground text-lg">
          <p>
              &copy; {new Date().getFullYear()} <span className=" bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
              VeilX
            </span>. All rights reserved.
            </p>
          </span>
            
          </div>
        </div>
      </footer>
    </>
  );
}

function CoinsIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
      <path d="M7 6h1v4" />
      <path d="m16.71 13.88.7.71-2.82 2.82" />
    </svg>
  );
}

function DatabaseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5V19A9 3 0 0 0 21 19V5" />
      <path d="M3 12A9 3 0 0 0 21 12" />
    </svg>
  );
}

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </svg>
  );
}

function FileIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    </svg>
  );
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}

function SaveIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
      <path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7" />
      <path d="M7 3v4a1 1 0 0 0 1 1h7" />
    </svg>
  );
}

function StoreIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}

function ToggleRightIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="12" x="2" y="6" rx="6" ry="6" />
      <circle cx="16" cy="12" r="2" />
    </svg>
  );
}

function UploadIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
      <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
    </svg>
  );
}
