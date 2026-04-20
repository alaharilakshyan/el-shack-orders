import brisket from "@/assets/dish-brisket.jpg";
import burger from "@/assets/dish-burger.jpg";
import ribs from "@/assets/dish-ribs.jpg";
import tacos from "@/assets/dish-tacos.jpg";
import elote from "@/assets/dish-elote.jpg";
import mac from "@/assets/dish-mac.jpg";
import aguafresca from "@/assets/dish-aguafresca.jpg";
import oldfashioned from "@/assets/dish-oldfashioned.jpg";
import tresleches from "@/assets/dish-tresleches.jpg";

// Map dish name → bundled image (DB stores reference path, components resolve)
export const dishImages: Record<string, string> = {
  "Smoked Brisket Platter": brisket,
  "El Shack Burger": burger,
  "Wood-Fire St. Louis Ribs": ribs,
  "Spicy Chicken Tacos": tacos,
  "Elote Street Corn": elote,
  "Smoked Mac & Cheese": mac,
  "Agua Fresca Trio": aguafresca,
  "Smoked Old Fashioned": oldfashioned,
  "Tres Leches Cake": tresleches,
};

export const resolveDishImage = (name: string, fallback?: string | null) =>
  dishImages[name] ?? fallback ?? brisket;
