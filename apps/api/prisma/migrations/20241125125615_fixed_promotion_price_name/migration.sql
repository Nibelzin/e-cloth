/*
  Warnings:

  - You are about to drop the column `promotion_price` on the `Product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "promotion_price",
ADD COLUMN     "promotionPrice" DECIMAL(65,30);
