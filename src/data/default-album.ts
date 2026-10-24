import type { Album } from "./album-schema";
export const defaultAlbum: Album = {
  sender: "Anaya",
  recipient: "Aarav",
  relationship: "Someone dear",
  senderCity: "Jaipur",
  recipientCity: "Bengaluru",
  opening: "Come in. I've saved a little light for you.",
  blessing:
    "May your home hold peace, your days bring good health, and the year ahead make room for quiet happiness.",
  letter:
    "The house smells of marigolds and cardamom. Someone is asking where the matches are, and the first diya has already been lit. Everything feels familiar. Except your place beside us.\n\nI can't bring the whole celebration to you, but I wanted you to feel that you were part of mine. So here are a few little pieces of this evening: a light at the door, a wish for your home, and all the things I would have told you if you were here.\n\nWherever tonight finds you, I hope it feels warm. There is always a place for you here.",
  closing:
    "Until we can light these diyas together, this little corner of Diwali is yours.",
  wishes: [
    "More peace in your days.",
    "More joy in the things you love.",
    "More moments together, wherever life takes us.",
  ],
  memories: [],
  sound: false,
};
