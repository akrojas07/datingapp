import { PhotoResponse } from "../_matchesModels/PhotoResponse";

export class GetUsersByUserIdResponse {
    firstName: string;
    lastName: string;
    username: string;
    password: string; 
    location: string;
    interests: string;
    gender: boolean;
    photo: PhotoResponse;
    id: number;
}
