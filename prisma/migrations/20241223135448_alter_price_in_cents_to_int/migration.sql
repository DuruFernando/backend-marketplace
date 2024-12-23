/*
  Warnings:

  - You are about to alter the column `price_in_cents` on the `products` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Integer`.

*/
-- AlterTable
ALTER TABLE "products" ALTER COLUMN "price_in_cents" SET DATA TYPE INTEGER;
