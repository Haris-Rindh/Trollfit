import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyJWT } from "@/lib/jwt";
import { z } from "zod";

const createAddressSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(5, "Phone is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  isDefault: z.boolean().optional(),
});

const updateAddressSchema = z.object({
  id: z.string().min(1, "Address ID is required"),
  name: z.string().min(1, "Name is required").optional(),
  phone: z.string().min(5, "Phone is required").optional(),
  address: z.string().min(1, "Address is required").optional(),
  city: z.string().min(1, "City is required").optional(),
  isDefault: z.boolean().optional(),
});

async function getSession(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const token = cookieHeader
    ?.split("; ")
    .find((row) => row.startsWith("trollfit-session="))
    ?.split("=")[1];

  if (!token) return null;
  return await verifyJWT(token);
}

// CREATE address
export async function POST(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = createAddressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, phone, address, city, isDefault } = result.data;
    const userId = session.userId;

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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// UPDATE address details
export async function PUT(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = updateAddressSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.errors[0].message },
        { status: 400 }
      );
    }

    const { id, name, phone, address, city, isDefault } = result.data;
    const userId = session.userId;

    // Verify ownership of the address being modified (prevent IDOR)
    const existingAddress = await db.address.findUnique({
      where: { id },
    });

    if (!existingAddress || existingAddress.userId !== userId) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 403 }
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE address
export async function DELETE(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    const userId = session.userId;

    // Verify ownership of the address (prevent IDOR)
    const addressToDelete = await db.address.findUnique({
      where: { id },
    });

    if (!addressToDelete || addressToDelete.userId !== userId) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 403 }
      );
    }

    await db.address.delete({
      where: { id },
    });

    // If we deleted the default address, set another remaining address as default
    if (addressToDelete.isDefault) {
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// SET DEFAULT address (PATCH)
export async function PATCH(req: Request) {
  try {
    const session = await getSession(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 }
      );
    }

    const userId = session.userId;

    // Verify ownership of the address (prevent IDOR)
    const targetAddress = await db.address.findUnique({
      where: { id },
    });

    if (!targetAddress || targetAddress.userId !== userId) {
      return NextResponse.json(
        { error: "Address not found or unauthorized" },
        { status: 403 }
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
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
