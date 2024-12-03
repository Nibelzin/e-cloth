-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_idCategory_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "idCategory" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_idCategory_fkey" FOREIGN KEY ("idCategory") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
