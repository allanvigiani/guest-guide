import * as dotenv from "dotenv"
// Load env — .env.local takes priority (Next.js convention), .env as fallback
dotenv.config({ path: ".env.local" })
dotenv.config({ path: ".env" })

import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaNeon } from "@prisma/adapter-neon"
import { neonConfig } from "@neondatabase/serverless"
import ws from "ws"

neonConfig.webSocketConstructor = ws

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-explicit-any
const prisma = new (PrismaClient as any)({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL! }),
})

async function main() {
  await prisma.$transaction([
    prisma.property.upsert({
      where: { code: "FLN001" },
      update: {},
      create: {
        code: "FLN001",
        name: "Apartamento Beira-Mar Florianópolis",
        propertyType: "Apartamento",
        bedroomQty: 2,
        bathroomQty: 1,
        guestCapacity: 4,
        images: ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"],
        address: {
          create: {
            street: "Rua Lauro Linhares",
            number: "589",
            complement: "Apto 301",
            neighborhood: "Trindade",
            city: "Florianópolis",
            state: "SC",
            postalCode: "88036-001",
          },
        },
        operational: {
          create: {
            wifiNetwork: "SeaHome_FLN001",
            wifiPassword: "floripa2024",
            isSelfCheckin: true,
            propertyAccessType: "smart_lock",
            propertyAccessInstructions: "Use o código 4521 na fechadura eletrônica",
            propertyPassword: "4521",
            hasParkingSpot: true,
            parkingSpotIdentifier: "Vaga 12 — subsolo B1",
            parkingSpotInstructions: "Portão lateral, código 7890 no interfone",
          },
        },
        rules: {
          create: {
            checkInTime: "15:00",
            checkOutTime: "11:00",
            allowPet: false,
            smokingPermitted: false,
            suitableForChildren: true,
            suitableForBabies: true,
            eventsPermitted: false,
          },
        },
        amenities: {
          create: {
            wifi: true,
            tv: true,
            airConditioning: true,
            kitchen: true,
            washingMachine: true,
            elevator: true,
            balcony: true,
          },
        },
        host: {
          create: {
            name: "Ana Paula",
            phone: "+5548991234567",
          },
        },
      },
    }),

    prisma.property.upsert({
      where: { code: "GRM001" },
      update: {},
      create: {
        code: "GRM001",
        name: "Chalé Serra Gramado",
        propertyType: "Casa",
        bedroomQty: 3,
        bathroomQty: 2,
        guestCapacity: 6,
        images: ["https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?w=800"],
        address: {
          create: {
            street: "Rua das Hortênsias",
            number: "220",
            complement: null,
            neighborhood: "Planalto",
            city: "Gramado",
            state: "RS",
            postalCode: "95670-000",
          },
        },
        operational: {
          create: {
            wifiNetwork: "ChaletSerra_GRM",
            wifiPassword: "gramado@2024",
            isSelfCheckin: false,
            propertyAccessType: "keybox",
            propertyAccessInstructions: "A chave está no cofre na entrada. Código: 1983",
            propertyPassword: "1983",
            hasParkingSpot: true,
            parkingSpotIdentifier: null,
            parkingSpotInstructions: "Garagem própria para 2 carros",
          },
        },
        rules: {
          create: {
            checkInTime: "14:00",
            checkOutTime: "12:00",
            allowPet: true,
            smokingPermitted: false,
            suitableForChildren: true,
            suitableForBabies: false,
            eventsPermitted: false,
          },
        },
        amenities: {
          create: {
            wifi: true,
            tv: true,
            kitchen: true,
            bbqGrill: true,
            balcony: true,
            dishwasher: true,
          },
        },
        host: {
          create: {
            name: "Carlos Eduardo",
            phone: "+5554998765432",
          },
        },
      },
    }),
    prisma.property.upsert({
      where: { code: "RIO001" },
      update: {},
      create: {
        code: "RIO001",
        name: "Cobertura Vista Mar Ipanema",
        propertyType: "Cobertura",
        bedroomQty: 3,
        bathroomQty: 2,
        guestCapacity: 6,
        images: ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"],
        address: {
          create: {
            street: "Rua Vinícius de Moraes",
            number: "134",
            complement: "Cobertura 2",
            neighborhood: "Ipanema",
            city: "Rio de Janeiro",
            state: "RJ",
            postalCode: "22411-010",
          },
        },
        operational: {
          create: {
            wifiNetwork: "SeaHome_RIO001",
            wifiPassword: "ipanema2024",
            isSelfCheckin: true,
            propertyAccessType: "smart_lock",
            propertyAccessInstructions: "Use o código 3762 na fechadura eletrônica da entrada",
            propertyPassword: "3762",
            hasParkingSpot: true,
            parkingSpotIdentifier: "Vaga 8 — térreo",
            parkingSpotInstructions: "Acesso pela garagem lateral, informe vaga 8 no interfone",
          },
        },
        rules: {
          create: {
            checkInTime: "15:00",
            checkOutTime: "11:00",
            allowPet: false,
            smokingPermitted: false,
            suitableForChildren: true,
            suitableForBabies: false,
            eventsPermitted: false,
          },
        },
        amenities: {
          create: {
            wifi: true,
            tv: true,
            airConditioning: true,
            kitchen: true,
            washingMachine: true,
            elevator: true,
            balcony: true,
            pool: true,
          },
        },
        host: {
          create: {
            name: "Mariana Costa",
            phone: "+5521997654321",
          },
        },
      },
    }),

    prisma.property.upsert({
      where: { code: "MRC001" },
      update: {},
      create: {
        code: "MRC001",
        name: "Casa Pé na Areia Maricá",
        propertyType: "Casa",
        bedroomQty: 4,
        bathroomQty: 3,
        guestCapacity: 8,
        images: ["https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800"],
        address: {
          create: {
            street: "Estrada do Cajueiro",
            number: "47",
            complement: null,
            neighborhood: "Barra de Maricá",
            city: "Maricá",
            state: "RJ",
            postalCode: "24900-000",
          },
        },
        operational: {
          create: {
            wifiNetwork: "CasaMarica_MRC001",
            wifiPassword: "marica2024",
            isSelfCheckin: true,
            propertyAccessType: "keybox",
            propertyAccessInstructions: "Cofre na grade do portão, código 5891",
            propertyPassword: "5891",
            hasParkingSpot: true,
            parkingSpotIdentifier: null,
            parkingSpotInstructions: "Garagem coberta para 2 carros, acesso pelo portão lateral",
          },
        },
        rules: {
          create: {
            checkInTime: "14:00",
            checkOutTime: "12:00",
            allowPet: true,
            smokingPermitted: false,
            suitableForChildren: true,
            suitableForBabies: true,
            eventsPermitted: false,
          },
        },
        amenities: {
          create: {
            wifi: true,
            tv: true,
            airConditioning: true,
            kitchen: true,
            washingMachine: true,
            balcony: true,
            bbqGrill: true,
            pool: true,
          },
        },
        host: {
          create: {
            name: "Allan Vigiani",
            phone: "+5521999999999",
          },
        },
      },
    }),
  ])

  console.log("Seed completed: FLN001, GRM001, RIO001 and MRC001 upserted.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
