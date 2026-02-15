-- CreateTable
CREATE TABLE "Plat" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "photo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Allergene" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "Allergene_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlatToService" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_AllergeneToPlat" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Allergene_label_key" ON "Allergene"("label");

-- CreateIndex
CREATE UNIQUE INDEX "_PlatToService_AB_unique" ON "_PlatToService"("A", "B");

-- CreateIndex
CREATE INDEX "_PlatToService_B_index" ON "_PlatToService"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_AllergeneToPlat_AB_unique" ON "_AllergeneToPlat"("A", "B");

-- CreateIndex
CREATE INDEX "_AllergeneToPlat_B_index" ON "_AllergeneToPlat"("B");

-- AddForeignKey
ALTER TABLE "_PlatToService" ADD CONSTRAINT "_PlatToService_A_fkey" FOREIGN KEY ("A") REFERENCES "Plat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlatToService" ADD CONSTRAINT "_PlatToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergeneToPlat" ADD CONSTRAINT "_AllergeneToPlat_A_fkey" FOREIGN KEY ("A") REFERENCES "Allergene"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AllergeneToPlat" ADD CONSTRAINT "_AllergeneToPlat_B_fkey" FOREIGN KEY ("B") REFERENCES "Plat"("id") ON DELETE CASCADE ON UPDATE CASCADE;
