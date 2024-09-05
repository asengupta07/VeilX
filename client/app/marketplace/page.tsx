"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Minus, Plus, ShoppingCart, Sun, Moon } from "lucide-react";
import { useStateContext } from "../contexts/StateContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const products = [
  {
    id: 1,
    name: "Miscellaneous PDFs",
    price: 2.0,
    image: "https://cdn.mos.cms.futurecdn.net/25mEf9H2CYfpdX53bWHjK.jpg",
  },
  {
    id: 2,
    name: "Resume Data",
    price: 1.6,
    image:
      "https://static.vecteezy.com/system/resources/previews/010/697/590/non_2x/professional-cv-resume-template-design-and-letterhead-cover-letter-for-ui-ux-designer-cv-layout-with-photo-placeholder-minimalist-style-vector.jpg",
  },
  {
    id: 3,
    name: "ID Images",
    price: 2.5,
    image:
      "https://www.takeonedigitalnetwork.com/wp-content/uploads/2023/11/image-170-1024x683-1.png",
  },
  {
    id: 4,
    name: "Certificates",
    price: 0.1,
    image:
      "https://5.imimg.com/data5/SELLER/Default/2023/2/SJ/GQ/KJ/934071/customized-award-certificate.jpg",
  },
];

export default function Component() {
  return (
    <div className="min-h-[90vh] bg-white dark:bg-black p-8 transition-colors duration-300">
      <h1 className="text-5xl font-bold text-center mb-12 text-black dark:text-white">
        <span className="bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-purple-500 via-violet-500 to-pink-500 py-4">
          VeilX{" "}
        </span>
        Data Market
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: any }) {
  const { address, buyData } = useStateContext();
  const [quantity, setQuantity] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-purple-500 rounded-lg opacity-20 blur-md"></div>
      <Card className="relative overflow-hidden bg-white dark:bg-black border border-purple-500 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="p-0">
          <div className="overflow-hidden">
            <motion.img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-xl font-semibold text-purple-600 dark:text-purple-400 mb-2">
            {product.name}
          </CardTitle>
          <p className="text-purple-500 dark:text-purple-300 font-bold">
            {product.price.toFixed(2)} AVAX/100 units
          </p>
        </CardContent>
        <CardFooter className="p-4 bg-purple-100 dark:bg-purple-900 bg-opacity-30 dark:bg-opacity-30">
          <div className="flex items-center justify-between gap-2 w-full">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white dark:hover:text-black"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-16 text-center bg-transparent border-purple-500 text-purple-500 dark:text-purple-300"
              />
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full border-purple-500 text-purple-500 hover:bg-purple-500 hover:text-white dark:hover:text-black"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={() => {
                buyData((product.price * quantity).toFixed(2));
              }}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Buy {(product.price * quantity).toFixed(2)} AVAX
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
