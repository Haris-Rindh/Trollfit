import { createUploadthing, type FileRouter } from "uploadthing/next";
import { verifyJWT } from "@/lib/jwt";

const f = createUploadthing();

// FileRouter for our app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  designUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      // Extract session token from cookie
      const cookieHeader = req.headers.get("cookie");
      const token = cookieHeader
        ?.split("; ")
        .find((row) => row.startsWith("trollfit-session="))
        ?.split("=")[1];

      if (!token) throw new Error("Unauthorized: Session token missing");
      
      const session = await verifyJWT(token);
      if (!session) throw new Error("Unauthorized: Invalid session");

      // Whatever returned here is accessible in onUploadComplete as `metadata`
      return { userId: session.userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for design print by user:", metadata.userId, "url:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
