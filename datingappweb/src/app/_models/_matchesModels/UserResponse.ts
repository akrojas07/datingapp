import { PhotoResponse } from "./PhotoResponse";

export class UserResponse {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    location: string;
    gender: boolean;
    interests: string;
    about: string;
    photo: PhotoResponse;
}
