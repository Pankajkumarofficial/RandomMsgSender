import { Message } from "@/models/User";

export interface ApiResponse {
    success: boolean,
    message: string,
    isAcceptionMessages?: boolean,
    messages?: Array<Message>
}