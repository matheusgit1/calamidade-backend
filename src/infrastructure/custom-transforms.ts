import { Transform } from "class-transformer";

export function NumericOnlyTransform() {
  return Transform(({ value }) => {
    if (typeof value === "string") {
      return value.replace(/\D/g, "");
    }
    return value;
  });
}
