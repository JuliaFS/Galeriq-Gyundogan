import { Timestamp } from "firebase/firestore";

export interface ImageDataProps {
    id: string;
    url: string;
    category: string;
    createdAt: Timestamp;
    description: string;
    title: string;
    author: string;
    userUid: string;
  }
