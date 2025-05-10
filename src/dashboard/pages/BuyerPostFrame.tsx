"use client";

import ProductImage from "./ProductImage";
import { ProductDetails } from "./ProductDetails";
import ProductDescription from "./ProductDescription";

function BuyerPostFrame() {
  return (
    <main className="overflow-hidden px-12 pt-12 bg-white max-md:px-5">
      <div className="max-md:mr-2 max-md:max-w-full">
        <div className="flex gap-5 max-md:flex-col">
          <section className="w-[42%] max-md:ml-0 max-md:w-full">
            <div className="flex flex-col grow max-md:mt-6">
              <ProductImage />
              <h2 className="self-start mt-9 ml-2.5 text-2xl text-neutral-500">
                Product Description:
              </h2>
            </div>
          </section>

          <section className="ml-5 w-[58%] max-md:ml-0 max-md:w-full">
            <ProductDetails
              product={{
                id: 1,
                image: "https://via.placeholder.com/150",
                name: "Sample Product",
                price: "₱1,000,000",
                // add other fields if needed
              }}
              onBack={() => {}}
            />
          </section>
        </div>
      </div>

      <ProductDescription />
    </main>
  );
}

export default BuyerPostFrame;
