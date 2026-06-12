export interface TrainingResponseDto {
  id: string;
  name: string;
  date: string;
  duration: number;
  status: string;
  coachName: string;
  location: string;
  maxParticipants: number;
  clubId: string;
  clubName: string;
  registeredParticipantsCount: number;
  usedResources: string;
}

export interface CreateTrainingDto {
  name: string;
  date: string;
  duration: number;
  clubId: string;
  coachName: string;
  location: string;
  maxParticipants: number;
  status: string;
  usedResources: string;
}

export interface UpdateTrainingDto {
  name?: string;
  date?: string;
  duration?: number;
  coachName?: string;
  location?: string;
  maxParticipants?: number;
  status?: string;
  usedResources?: string;
}