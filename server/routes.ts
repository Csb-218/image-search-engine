import express from "express";
import multer from "multer";
import { extname } from "path";
import { queryImages } from "./query.ts";
import { listFiles } from "./utils/util.ts";
import { indexImages } from "./indexImages.ts";
import { upsertImages } from "./upsertImages.js";
import { deleteImage } from "./deleteImage.js";
import { upload_save } from "./middlewares/fileUploadSave.ts";
import { upload } from "./middlewares/fileUpload.ts";

interface Route {
  route: string;
  method: "get" | "post" | "put" | "delete";
  handler: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => void;
}

function getImagesInRange(
  page: number,
  pageSize: number,
  imagePaths: string[]
): string[] {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return imagePaths.slice(start, end);
}

// // Save newly uploaded images to the data directory
// const upload = multer({ dest: "data/" }).array("images");
// const memoryUpload = multer({ storage: multer.memoryStorage() }).array(
//   "images"
// );

const solve = async (req: express.Request, res: express.Response) => {
  res.status(200);
};

const routes: Route[] = [
  {
    route: "/indexImages",
    method: "get",
    handler: async (req, res) => {
      try {
        await indexImages();
        res.status(200).json({ message: "Indexing complete" });
      } catch (error) {
        res.status(500).json({ error: "Error indexing images" });
      }
    },
  },
  {
    route: "/getImages",
    method: "get",
    handler: async (req, res) => {
      const page = parseInt(req.query.page as string, 10) || 1;
      const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
      const imagePaths = await listFiles("./data");

      try {
        const images = getImagesInRange(page, pageSize, imagePaths).map(
          (image) => ({
            src: image,
          })
        );
        res.status(200).json(images);
      } catch (error) {
        console.log("ERROR: ", error);
        res.status(500).json({ error: "Error fetching images" });
      }
    },
  },
  {
    route: "/search",
    method: "get",
    handler: async (req, res) => {
      const imagePath = req.query.imagePath as string;

      try {
        const matchingImages = await queryImages(imagePath);
        res.status(200).json(matchingImages);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error fetching images" });
      }
    },
  },
  {
    route: "/save",
    method: "post",
    handler: async (req, res, next) => {
      // Use multer's single-file memory storage to access original file data
      upload(req, res, async (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error uploading images" });
          return;
        }

        if (!req.files || req.files.length === 0) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }
        res.status(200).send("saved images temporarily");
      });
    },
  },
  {
    route: "/uploadImages",
    method: "post",
    handler: async (req, res, next) => {
      // Use multer's single-file memory storage to access original file data
      upload_save(req, res, async (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: "Error uploading images" });
          return;
        }

        if (!req.files || req.files.length === 0) {
          res.status(400).json({ error: "No files uploaded" });
          return;
        }
        // res.status(200).send("uploaded images");
        // Save files with original name in ./data
        const uploadedImagePaths: string[] = [];
        for (const file of req.files as Express.Multer.File[]) {
          //   // const destPath = path.join("./data", Date.now()+extname(file.originalname));
          //   // await fs.writeFile(destPath, file.buffer);
          uploadedImagePaths.push(file.path);
        }

        try {
          await upsertImages(uploadedImagePaths);
          // Return the page number of the first image uploaded (for demo purposes)
          // const imagePaths = await listFiles("./data");
          // const pageSize = parseInt(req.query.pageSize as string, 10) || 10;
          // const pageOfFirstImage =
          //   Math.floor(imagePaths.indexOf(uploadedImagePaths[0]) / pageSize) +
          //   1;
          res.status(200).json({ message: "uploaded" });
        } catch (error) {
          res.status(500).json({ error: "Error uploading images" });
        }
      });
    },
  },
  {
    route: "/deleteImage",
    method: "delete",
    handler: async (req, res) => {
      const imagePath = req.query.imagePath as string;

      try {
        await deleteImage(imagePath);
        res.status(200).json({ message: "Image deleted" });
      } catch (error) {
        res.status(500).json({ error: "Error deleting image" });
      }
    },
  },
];

export { routes as resolvers };
