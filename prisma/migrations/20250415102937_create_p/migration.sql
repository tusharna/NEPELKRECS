-- CreateTable
CREATE TABLE "Players" (
    "id" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Surname" TEXT NOT NULL,
    "Country" TEXT NOT NULL,
    "DOB" TIMESTAMP(3),
    "Age" INTEGER NOT NULL,
    "Specialism" TEXT NOT NULL,
    "Batting" TEXT NOT NULL,
    "Bowiling" TEXT,
    "Team" TEXT,

    CONSTRAINT "Players_pkey" PRIMARY KEY ("id")
);
