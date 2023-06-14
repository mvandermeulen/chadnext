import { getToken } from "next-auth/jwt";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import db from "~/lib/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f(["image"])
    // Set permissions and file types for this FileRoute
    .middleware(async (req) => {
      // This code runs on your server before upload
      const token = await getToken({ req });

      // If you throw, the user will not be able to upload
      if (!token) throw new Error("Unauthorized!");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: token.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      const foundUser = await db.user.findFirst({
        where: { id: metadata.userId },
      });

      if (!foundUser) throw new Error("User not found!");

      await db.user.update({
        where: { id: metadata.userId },
        data: {
          image: file.url,
        },
      });

      await fetch(
        process.env.NEXTAUTH_URL + "/api/revalidate?path=/dashboard/settings"
      );
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
