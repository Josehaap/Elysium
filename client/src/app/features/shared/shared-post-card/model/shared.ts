import { infoDataPost } from "src/app/features/platform/pages/home-platform/models/home";

export interface responseApiShared {
    Success: boolean; 
    Data:infoDataPost; 
    Error: string
}
