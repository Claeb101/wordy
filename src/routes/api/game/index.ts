import { HASH_KEY } from "$env/static/private";
import { getDay } from "@/lib";
import * as CryptoJS from "crypto-js";

export type Settings = { boards: number, guesses: number, sequential: boolean, seed?: number, day: number }

export const validateSettings = (settings: Settings) => {
  return settings.boards > 0 && settings.guesses > 0 && settings.sequential != undefined && settings.day <= getDay()
}

export const toId = (settings: Settings) => {
  const plain = [settings.boards, settings.guesses, settings.sequential, settings.seed, settings.day].join("|")
  const id = encode(plain)

  return id
}

export const encode = (plain: string) => {
  return CryptoJS.AES.encrypt(plain.toString(), HASH_KEY).toString()
}
export const decode = (id: string) => {
  return CryptoJS.AES.decrypt(id, HASH_KEY).toString(CryptoJS.enc.Utf8)
}

export const fromId = (id: string): Settings => {
  const plain = decode(id)
  const [boards, guesses, sequential, seed, day] = plain.split("|")

  return {
    boards: parseInt(boards),
    guesses: parseInt(guesses),
    sequential: sequential === "true",
    day: parseInt(day),
    seed: parseInt(seed) == 0 ? undefined : parseInt(seed)
  }
}