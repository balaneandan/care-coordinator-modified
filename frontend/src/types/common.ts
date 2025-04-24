export type ImageType = {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
};

export type PatientCore = {
  name: string;
  id: string;
};

export type Doctor = {
  name: string;
  avatarIcon: string;
  id: string;
};

export type AppointmentDetails = {
  type: string;
  status: string;
  iconUrl: string;
  iconColour: string;
  textColour: string;
};

export type AppointmentType = "create" | "cancel" | "schedule";
