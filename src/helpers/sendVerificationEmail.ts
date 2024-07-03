import { resend } from "@/lib/resend";
import VerificationEmail from "../../email/verficationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export const sendVerificationEmail = async (email: string, username: string, verifyCode: string): Promise<ApiResponse> => {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'MystryMsg | Verification Code',
            react: VerificationEmail({ username, otp: verifyCode }),
        });
        return {
            success: true,
            message: 'verification email send successfully'
        }
    } catch (emailError) {
        console.error("error in sending verification code", emailError)
        return {
            success: false,
            message: 'failed to send verification code'
        }
    }
}