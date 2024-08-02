import { UserProfileDTO } from "./userProfile.dto";

export class UserResponseDTO {
	code: number;
	data?: UserProfileDTO;
}
