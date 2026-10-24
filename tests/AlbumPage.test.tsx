import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HandmadeLetter } from "../src/components/HandmadeLetter";
import { FoldedNote } from "../src/components/FoldedNote";
import { AlbumPage } from "../src/components/AlbumPage";
import type { Album } from "../src/data/album-schema";
const album: Album = {
  sender: "Asha",
  recipient: "Meera",
  relationship: "Sister",
  senderCity: "Delhi",
  recipientCity: "Pune",
  opening: "Hello",
  blessing: "Peace",
  letter: "A personal letter from my home to yours.",
  closing: "Always welcome.",
  wishes: ["Peace", "Joy", "Togetherness"],
  memories: [],
  sound: false,
};
afterEach(cleanup);
describe("physical album interactions", () => {
  it("opens the letter and lets the reader skip progressive writing", () => {
    render(
      <HandmadeLetter
        text={album.letter}
        sender={album.sender}
        recipient={album.recipient}
        quiet={false}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open your letter" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Read the whole letter" }),
    );
    expect(screen.getByText(album.letter)).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Read the whole letter" }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Fold my letter away" }),
    );
    expect(screen.queryByText(album.letter)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open your letter" }));
    expect(screen.getByText(album.letter)).toBeVisible();
  });
  it("shows the full letter immediately in quiet mode", () => {
    render(
      <HandmadeLetter
        text={album.letter}
        sender={album.sender}
        recipient={album.recipient}
        quiet
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open your letter" }));
    expect(screen.getByText(album.letter)).toBeVisible();
    expect(
      screen.queryByRole("button", { name: "Read the whole letter" }),
    ).not.toBeInTheDocument();
  });
  it("opens, folds and reopens each custom wish", () => {
    render(<FoldedNote text="More shared evenings." index={1} />);
    fireEvent.click(screen.getByRole("button", { name: "Open wish 2" }));
    expect(screen.getByText("More shared evenings.")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Fold wish 2 away" }));
    expect(screen.queryByText("More shared evenings.")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Open wish 2" }));
    expect(screen.getByText("More shared evenings.")).toBeVisible();
  });
  it("enlarges a local photo and restores focus after Escape", () => {
    render(
      <AlbumPage
        id="memories"
        album={{
          ...album,
          memories: [
            {
              id: "one",
              src: "data:image/png;base64,AAAA",
              caption: "Our doorstep",
              date: "Diwali",
            },
          ],
        }}
        quiet
        onReplay={vi.fn()}
      />,
    );
    const root = document.querySelector(".scene-memories")!.parentElement!;
    root.id = "root";
    const trigger = screen.getByRole("button", {
      name: "Enlarge photo 1: Our doorstep",
    });
    trigger.focus();
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog", { name: "Our doorstep" })).toBeVisible();
    expect(root).toHaveAttribute("aria-hidden", "true");
    expect(root.inert).toBe(true);
    expect(
      screen.getByRole("button", { name: /Close photograph/ }),
    ).toHaveFocus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(
      screen.getByRole("button", { name: /Close photograph/ }),
    ).toHaveFocus();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(root).not.toHaveAttribute("aria-hidden");
    expect(root.inert).toBe(false);
  });
  it("lights the diya and reveals city labels", () => {
    const view = render(
      <AlbumPage id="diya" album={album} quiet onReplay={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /Light the diya/ }));
    expect(screen.getByRole("status")).toHaveTextContent(
      "Here's a little light",
    );
    view.rerender(
      <AlbumPage id="homes" album={album} quiet onReplay={vi.fn()} />,
    );
    fireEvent.click(screen.getByRole("button", { name: /My light/ }));
    expect(screen.getByText("Delhi")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: /Your light/ }));
    expect(screen.getByText("Pune")).toBeVisible();
  });
});
