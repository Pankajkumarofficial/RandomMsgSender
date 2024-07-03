import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs';

export const POST = async (request: Request) => {
    await dbConnect();
    try {
        const { username, email, password } = await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({ username, isVerfied: true })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username Already exist"
            }, { status: 400 })
        }
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerfied) {
                return Response.json({
                    success: false,
                    message: 'User already exist with this email'
                }, { status: 400 })
            } else {
                const hasedPassword = await bcrypt.hash(password, 10)
                existingUserByEmail.password = hasedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000)
                await existingUserByEmail.save();
            }
        } else {
            const hasedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hasedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerfied: false,
                isAcceptingMessage: true,
                message: []
            })
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(email, username, verifyCode)
        if (!emailResponse.success) {
            return Response.json({
                success: false,
                message: emailResponse.message
            }, { status: 500 })
        }
        return Response.json({
            success: true,
            message: "User Register Successfully! Please verify the email"
        }, { status: 201 })
    } catch (error) {
        console.error('Error registring Post', error)
        return Response.json({
            success: false,
            message: "Error in registering User"
        }, {
            status: 500
        })
    }
}