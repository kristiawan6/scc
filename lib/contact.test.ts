import { expect, test } from "bun:test";
import { validateContact } from "./contact";

const ok = { name: "Budi", email: "budi@mail.com", phone: "", topic: "general", message: "Halo, saya mau bertanya." };

test("valid input has no errors", () => {
  expect(validateContact(ok)).toEqual({});
  expect(validateContact({ ...ok, phone: "+62 812-1056-030" })).toEqual({});
});

test("flags each bad field", () => {
  const e = validateContact({ name: " ", email: "budi@", phone: "abc", topic: "hack", message: "hi" });
  expect(Object.keys(e).sort()).toEqual(["email", "message", "name", "phone", "topic"]);
});
