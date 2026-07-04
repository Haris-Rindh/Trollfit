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

// CREATE new product
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      description,
      shortDesc,
      price,
      salePrice,
      sku,
      images,
      sizes,
      colors,
      stockBySize,
      featured,
      trending,
      isNew,
    } = body;

    if (!name || !description || price === undefined) {
      return NextResponse.json(
        { error: "Name, description and price are required" },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    let slug = baseSlug;
    let attempts = 0;
    while (attempts < 10) {
      const existing = await db.product.findUnique({ where: { slug } });
      if (!existing) break;
      slug = `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
      attempts++;
    }

    // Calculate total stock
    let totalStock = 0;
    if (typeof stockBySize === "object" && stockBySize !== null) {
      totalStock = Object.values(stockBySize).reduce(
        (acc: number, val: any) => acc + (Number(val) || 0),
        0
      );
    }

    const newProduct = await db.product.create({
      data: {
        name,
        slug,
        description,
        shortDesc: shortDesc || null,
        price: Number(price),
        salePrice: salePrice ? Number(salePrice) : null,
        sku: sku || null,
        images: Array.isArray(images) ? images : [],
        sizes: Array.isArray(sizes) ? sizes : ["S", "M", "L", "XL", "2XL"],
        colors: Array.isArray(colors) ? colors : ["#000000"],
        stockBySize: stockBySize || {},
        totalStock,
        featured: !!featured,
        trending: !!trending,
        isNew: isNew !== undefined ? !!isNew : true,
      },
    });

    return NextResponse.json({
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error: any) {
    console.error("Admin product creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

// DELETE a product
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    console.error("Admin product deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
