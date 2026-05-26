-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedroomQty" INTEGER NOT NULL,
    "bathroomQty" INTEGER NOT NULL,
    "guestCapacity" INTEGER NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "complement" TEXT,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "postalCode" TEXT NOT NULL,

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operational" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "wifiNetwork" TEXT NOT NULL,
    "wifiPassword" TEXT NOT NULL,
    "isSelfCheckin" BOOLEAN NOT NULL,
    "propertyAccessType" TEXT NOT NULL,
    "propertyAccessInstructions" TEXT NOT NULL,
    "propertyPassword" TEXT NOT NULL,
    "hasParkingSpot" BOOLEAN NOT NULL,
    "parkingSpotIdentifier" TEXT,
    "parkingSpotInstructions" TEXT,

    CONSTRAINT "Operational_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rules" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "checkInTime" TEXT NOT NULL,
    "checkOutTime" TEXT NOT NULL,
    "allowPet" BOOLEAN NOT NULL,
    "smokingPermitted" BOOLEAN NOT NULL,
    "suitableForChildren" BOOLEAN NOT NULL,
    "suitableForBabies" BOOLEAN NOT NULL,
    "eventsPermitted" BOOLEAN NOT NULL,

    CONSTRAINT "Rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Amenities" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "wifi" BOOLEAN NOT NULL DEFAULT false,
    "tv" BOOLEAN NOT NULL DEFAULT false,
    "airConditioning" BOOLEAN NOT NULL DEFAULT false,
    "kitchen" BOOLEAN NOT NULL DEFAULT false,
    "washingMachine" BOOLEAN NOT NULL DEFAULT false,
    "elevator" BOOLEAN NOT NULL DEFAULT false,
    "balcony" BOOLEAN NOT NULL DEFAULT false,
    "bbqGrill" BOOLEAN NOT NULL DEFAULT false,
    "dishwasher" BOOLEAN NOT NULL DEFAULT false,
    "pool" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Amenities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Host" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Host_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiences" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "welcomeMessage" TEXT NOT NULL,
    "restaurants" JSONB NOT NULL,
    "attractions" JSONB NOT NULL,
    "essentials" JSONB NOT NULL,
    "seasonalTip" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Property_code_key" ON "Property"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Address_propertyId_key" ON "Address"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Operational_propertyId_key" ON "Operational"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Rules_propertyId_key" ON "Rules"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Amenities_propertyId_key" ON "Amenities"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Host_propertyId_key" ON "Host"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "Experiences_propertyId_key" ON "Experiences"("propertyId");

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operational" ADD CONSTRAINT "Operational_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rules" ADD CONSTRAINT "Rules_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Amenities" ADD CONSTRAINT "Amenities_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Host" ADD CONSTRAINT "Host_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Experiences" ADD CONSTRAINT "Experiences_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
