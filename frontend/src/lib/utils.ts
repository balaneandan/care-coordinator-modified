import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function zip(...arrays: any[]) {
  const minLength = Math.min(...arrays.map((arr) => arr.length));
  return Array.from({ length: minLength }, (_, i) =>
    arrays.map((array) => array[i])
  );
}

export function title(item: string) {
  return item[0].toUpperCase() + item.substring(1, item.length);
}

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const convertFileToObject = (file: File) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);

  return new Promise((resolve, reject) => {
    reader.onload = function () {
      if (reader.result) {
        const base64String = String(reader.result).split(",")[1];

        const fileData = {
          filename: file.name,
          type: file.type,
          size: file.size,
          data: base64String,
        };

        resolve(fileData);
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = function (error) {
      reject(error);
    };
  });
};

export const formatDateTime = (datetime: string | Date) => {
  return new Date(datetime).toLocaleString("en-GB", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
};

export function encryptKey(passkey: string) {
  return btoa(passkey);
}

export function decryptKey(passkey: string) {
  return atob(passkey);
}
