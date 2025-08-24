// types/contact.ts
export interface IContact {
  _id?: string;  // MongoDB may not exist yet on new contacts
  company: string;
  name: string;
  role: string;
  email: string;
  numMeetings: number;
  lastMet: string | null;  // ISO string (backend) or date string (frontend form)
}

