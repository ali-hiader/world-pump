"use server";
import * as z from "zod";
import { db } from "..";
import { cartTable, productTable, user } from "@/db/schema";
import { eq, getTableColumns, asc, like, sql, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { slugifyIt } from "@/lib/utils";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const schema = z.object({
  image: z.instanceof(File, { message: "Invalid file format" }),

  title: z.string().min(1, "Product title is required"),

  price: z.string().min(1, "Price cannot be empty"),

  category: z.string().min(1, "Category cannot be empty"),

  description: z.string().min(1, "Description cannot be empty"),

  productDetail: z.string().min(1, "Product detail is required"),

  message: z.string().min(1, "Message is required"),
});

export interface NewProductState {
  success: boolean;
  imageError?: string[];
  titleError?: string[];
  priceError?: string[];
  categoryError?: string[];
  descriptionError?: string[];
  productDetailError?: string[];
  messageError?: string[];
  generalError?: string;
}
export async function addNewProduct(
  state: NewProductState | null,
  formdata: FormData
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw redirect("/sign-in");
  }

  const parsedData = schema.safeParse(formdata);

  if (!parsedData.success) {
    const fieldErrors = z.flattenError(parsedData.error).fieldErrors;
    return {
      success: false,
      imageError: fieldErrors.image,
      titleError: fieldErrors.title,
      priceError: fieldErrors.price,
      categoryError: fieldErrors.category,
      descriptionError: fieldErrors.description,
      productDetailError: fieldErrors.productDetail,
      messageError: fieldErrors.message,
    };
  }

  const product = parsedData.data;
  const arrayBuffer = await product.image.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await uploadImage(buffer, async (result: { url: string } | undefined) => {
    if (!result) {
      throw redirect("/add-product");
    }

    const imageUrl =
      result.url.split("/upload")[0] +
      "/upload" +
      "/q_auto/f_auto" +
      result.url.split("/upload")[1];

    await db.insert(product).values({
      category: product.category,
      description: product.description,
      imageUrl,
      message: product.message,
      price: +product.price,
      title: product.title,
      slug: slugifyIt(product.title),
      createdBy: session.user.id,
    });
    throw redirect("/seller-dashboard");
  });

  return {
    success: true,
  };
}

export async function fetchAllProducts(
  limit: number,
  offset: number,
  sortBy = "newest"
) {
  let orderBy = asc(productTable.id);
  if (sortBy === "fromLow") {
    orderBy = asc(productTable.price);
  }
  if (sortBy === "fromHigh") {
    orderBy = desc(productTable.price);
  }

  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  console.log(products);
  return products;
}

export async function fetchSimilarProducts(
  category: string,
  productName: string
) {
  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .where(
      sql`${productTable.category} = ${category} AND ${productTable.title} != ${productName}`
    )
    .limit(9);
  return products;
}

const searchSchema = z.object({
  search: z.string("Enter product name in form of text."),
});

interface SearchShirtState {
  inputError: string;
}

export async function searchShirt(state: SearchShirtState, formdata: FormData) {
  const parsedData = searchSchema.safeParse(formdata);

  if (!parsedData.success) {
    return {
      inputError: z.flattenError(parsedData.error).fieldErrors.search,
    };
  }

  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .where(
      like(
        sql`LOWER(${productTable.title})`,
        "%" + parsedData.data.search.toLowerCase() + "%"
      )
    )
    .limit(9)
    .orderBy(asc(productTable.title));
  return products;
}

export async function getProductDetail(slug: string) {
  const products = await db
    .select({
      user: { ...getTableColumns(user) },
      ...getTableColumns(productTable),
    })
    .from(productTable)
    .innerJoin(user, eq(productTable.createdBy, user.id))
    .where(like(productTable.slug, slug));
  return products;
}

export async function deleteProduct(id: number, imageUrl: string) {
  await db.delete(cartTable).where(eq(cartTable.productId, id));
  await db.delete(productTable).where(eq(productTable.id, id));

  const filePathMatch = imageUrl.match(/products-images%2F(.+?)\?/);
  if (filePathMatch) {
    const fileName = filePathMatch[1];
    try {
      await deleteImage(`products-images/${fileName}`);
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  }

  redirect("/seller-dashboard");
}

export async function getSingleShirt(shirtId: number) {
  const products = await db
    .select({
      cartId: cartTable.id,
      quantity: cartTable.quantity,
      ...getTableColumns(productTable),
    })
    .from(cartTable)
    .innerJoin(productTable, eq(cartTable.productId, productTable.id))
    .where(eq(cartTable.productId, shirtId));
  return products[0];
}
