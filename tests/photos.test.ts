import { describe, expect, it } from "vitest";
import {
  MAX_PHOTO_BYTES,
  photoDimensions,
  validatePhoto,
} from "../src/utils/photos";
describe("photo preparation", () => {
  it("rejects unsupported, empty and oversized files", () => {
    expect(validatePhoto({ type: "image/svg+xml", size: 500 })).toMatch(/JPG/);
    expect(
      validatePhoto({ type: "image/jpeg", size: MAX_PHOTO_BYTES + 1 }),
    ).toMatch(/15 MB/);
    expect(validatePhoto({ type: "image/png", size: 0 })).toMatch(/empty/);
    expect(validatePhoto({ type: "image/webp", size: 1000 })).toBeNull();
  });
  it("resizes in either orientation without upscaling", () => {
    expect(photoDimensions(4000, 3000)).toEqual({ width: 1600, height: 1200 });
    expect(photoDimensions(3000, 4000)).toEqual({ width: 1200, height: 1600 });
    expect(photoDimensions(800, 600)).toEqual({ width: 800, height: 600 });
  });
});
