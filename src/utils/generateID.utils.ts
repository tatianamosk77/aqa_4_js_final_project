import { ObjectId } from "bson";

export function generateID(): string {
  return new ObjectId().toHexString();
}
