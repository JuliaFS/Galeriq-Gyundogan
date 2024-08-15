import { Timestamp } from "firebase/firestore";

export interface ImageDataProps {
    id: string | null;
    url: string;
    category: string | null;
    createdAt: Timestamp | null;
    description: string | null;
    title: string | undefined;
    author: string | null;
    userUid: string | null;
  }
