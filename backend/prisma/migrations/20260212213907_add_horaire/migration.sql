-- CreateTable
CREATE TABLE "Horaire" (
    "id" SERIAL NOT NULL,
    "day" TEXT NOT NULL,
    "opening_time" TEXT NOT NULL,
    "closing_time" TEXT NOT NULL,

    CONSTRAINT "Horaire_pkey" PRIMARY KEY ("id")
);
