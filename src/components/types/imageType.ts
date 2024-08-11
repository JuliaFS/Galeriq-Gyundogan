import { Timestamp } from "firebase/firestore";

export interface ImageDataProps {
    id: string;
    url: string;
    category: string | null;
    createdAt: Timestamp | null;
    description: string | null;
    title: string | null;
    author: string | null;
  }