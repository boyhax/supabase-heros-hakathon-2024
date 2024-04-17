export type Card = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    metas: string;
    images?: string[];
    likes: number;
    type: string;
    body?:string,
    price?:number,
    created_at:string,
  };