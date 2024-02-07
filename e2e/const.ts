import dotenv from "dotenv"
import path from "path"

dotenv.config({
  path: path.resolve(__dirname, ".env"),
})

export const mainWalletPem = process.env.MAIN_WALLET_PEM as string
export const wallet1Seed = process.env.WALLET_1_SEED as string
export const wallet2Seed = process.env.WALLET_2_SEED as string
export const wallet3Seed = process.env.WALLET_3_SEED as string
export const destinationAddress = process.env.DESTINATION_ADDRESS as string
export const FIVE_MINUTES = 300_000
