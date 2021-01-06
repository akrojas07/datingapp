import { PhotoResponse } from "../PhotoResponse";

export class GetUserDetailResponse {
    id: number;
    username
    gender: boolean;
    location: string;
    firstName: string;
    lastName: string;
    interests: string;
    about: string;
    photo: PhotoResponse;
    
}
