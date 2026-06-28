import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET all products for admin
export async function GET(req: Request) {
  try {
    const products = await db.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ products });
  } catch (error: any) {
    console.error("Admin products fetch error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// UPDATE product details
export async function PUT(req: Request) {
  try {
    const { id, price, salePrice, stockBySize } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (price !== undefined) updateData.price = Number(price);
    if (salePrice !== undefined) updateData.salePrice = salePrice ? Number(salePrice) : null;
    if (stockBySize !== undefined) {
      updateData.stockBySize = stockBySize;
      
      // Calculate total stock sum from sizes JSON object
      if (typeof stockBySize === "object" && stockBySize !== null) {
        const totalStock = Object.values(stockBySize).reduce(
          (acc: number, val: any) => acc + (Number(val) || 0),
          0
        );
        updateData.totalStock = totalStock;
      }
    }

    const updatedProduct = await db.product.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error: any) {
    console.error("Admin product update error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}
