import { atom } from "recoil";
import { PopulationType } from "../props/populationType";

export const infoAtom = atom<PopulationType[]>({
  key: "infoAtom",
  default: [],
});
