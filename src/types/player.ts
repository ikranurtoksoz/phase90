
export interface Player {
  id: number;
  name: string;
  age: number;
  club: string;
  position: string;

  minutesPlayed: number;

  goalsPer90: number;
  assistsPer90: number;
  progressivePassesPer90: number;
  successfulDribblesPer90: number;
  tacklesWonPer90: number;
}
