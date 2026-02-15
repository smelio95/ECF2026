-- AlterTable
ALTER TABLE "Service" ADD COLUMN     "regime_id" INTEGER,
ADD COLUMN     "theme_id" INTEGER;

-- CreateTable
CREATE TABLE "Regime" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Regime_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Regime_label_key" ON "Regime"("label");

-- CreateIndex
CREATE UNIQUE INDEX "Theme_label_key" ON "Theme"("label");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_regime_id_fkey" FOREIGN KEY ("regime_id") REFERENCES "Regime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "Theme"("id") ON DELETE SET NULL ON UPDATE CASCADE;
