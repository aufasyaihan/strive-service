import "dotenv/config";
import { defineConfig } from "prisma/config";
import path from "path";

export default defineConfig({
    schema: path.join("./src/prisma", "schema.prisma"),
    migrations: {
        path: path.join("./src/prisma", "migrations"),
        seed: "ts-node ./src/prisma/seed.ts",
    },
});
