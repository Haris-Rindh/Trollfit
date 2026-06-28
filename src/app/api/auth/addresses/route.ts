import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// CREATE address
export async function POST(req: Request) {
  try {
    const { userId, name, phone, address, city, isDefault } = await req.json();

    if (!userId || !name || !phone || !address || !city) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if it's the user's first address, make it default regardless
    const userAddressesCount = await db.address.count({
      where: { userId },
    });

    const setAsDefault = isDefault || userAddressesCount === 0;

    if (setAsDefault) {
      // Set all other addresses for this user to default = false
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const newAddress = await db.address.create({
      data: {
        userId,
        name,
        phone,
        address,
        city,
        isDefault: setAsDefault,
      },
    });

    return NextResponse.json({
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (error: any) {
    console.error("Address creation error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE address details
export async function PUT(req: Request) {
  try {
    const { id, name, phone, address, city, isDefault, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Address ID and User ID are required" },
        { status: 400 }
      );
    }

    if (isDefault) {
      // Set all other addresses for this user to default = false
      await db.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    const updatedAddress = await db.address.update({
      where: { id },
      data: {
        name,
        phone,
        address,
        city,
        isDefault,
      },
    });

    return NextResponse.json({
      message: "Address updated successfully",
      address: updatedAddress,
    });
  } catch (error: any) {
    console.error("Address update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE address
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Address ID and User ID are required" },
        { status: 400 }
      );
    }

    // Find if the address we are deleting is default
    const addressToDelete = await db.address.findUnique({
      where: { id },
    });

    await db.address.delete({
      where: { id },
    });

    // If we deleted the default address, set another remaining address as default
    if (addressToDelete?.isDefault) {
      const remainingAddress = await db.address.findFirst({
        where: { userId },
      });

      if (remainingAddress) {
        await db.address.update({
          where: { id: remainingAddress.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      message: "Address deleted successfully",
    });
  } catch (error: any) {
    console.error("Address deletion error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// SET DEFAULT address (PATCH)
export async function PATCH(req: Request) {
  try {
    const { id, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { error: "Address ID and User ID are required" },
        { status: 400 }
      );
    }

    // Mark all user's addresses non-default
    await db.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });

    // Mark target default
    const updatedAddress = await db.address.update({
      where: { id },
      data: { isDefault: true },
    });

    return NextResponse.json({
      message: "Default address updated",
      address: updatedAddress,
    });
  } catch (error: any) {
    console.error("Set default address error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
