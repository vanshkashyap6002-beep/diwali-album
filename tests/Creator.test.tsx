import { fireEvent, render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Creator } from "../src/components/Creator";
import type { Album } from "../src/data/album-schema";
const album: Album = {
  sender: "A",
  recipient: "B",
  relationship: "Friend",
  senderCity: "Delhi",
  recipientCity: "Pune",
  opening: "Hello",
  blessing: "Light",
  letter: "A letter",
  closing: "Love",
  wishes: ["One", "Two", "Three"],
  memories: [],
  sound: false,
};
afterEach(cleanup);
describe("personalisation preview", () => {
  it("keeps edits local until preview and preserves text literally", () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    render(<Creator album={album} onChange={onChange} onClose={onClose} />);
    fireEvent.change(screen.getByLabelText("Your name"), {
      target: { value: "<script>My name</script>" },
    });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByText("Continue"));
    fireEvent.change(screen.getByLabelText("Your letter"), {
      target: { value: "A new letter" },
    });
    fireEvent.click(screen.getByText("Continue"));
    fireEvent.click(screen.getByText("Preview my Diwali"));
    expect(onChange).toHaveBeenCalledWith({
      ...album,
      sender: "<script>My name</script>",
      letter: "A new letter",
    });
    expect(onClose).toHaveBeenCalledOnce();
    expect(album.sender).toBe("A");
  });
  it("closes on Escape without applying an unfinished draft", () => {
    const onChange = vi.fn();
    const onClose = vi.fn();
    render(<Creator album={album} onChange={onChange} onClose={onClose} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
    expect(onChange).not.toHaveBeenCalled();
  });
});
