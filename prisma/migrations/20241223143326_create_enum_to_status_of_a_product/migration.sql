/*
  Warnings:

  - The `status` column on the `products` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('available', 'sold', 'cancelled');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "status",
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'available';
