export interface Users {
  id: number;
  userNo: string;
  fullName: string;
  hireDate: Date;
  position: Position;
}

export interface Position {
  positionName: string;
}
