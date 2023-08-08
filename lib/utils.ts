import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// created by chatGPT
export function isBase64Image(imageString: string) {
  // Regular expression to match Base64 image data
  const base64Regex =
    /^data:image\/(png|jpeg|jpg|gif);base64,([A-Za-z0-9+/=])+$/;

  // Check if the input matches the Base64 image data pattern
  return base64Regex.test(imageString);
}
