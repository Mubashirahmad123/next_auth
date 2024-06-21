import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { error } from "console";
import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import jwt from "jsonwebtoken";



connect()

export async function POST(request: NextRequest) {
    try { 
        const reqBody =  await request.json()
        const { email, password} = reqBody

        // Validation

        console.log(reqBody);


        console.log("MONGO_URI:", process.env.MONGO_URI);

         const user = await User.findOne({email})

        if (!user) {
            return NextResponse.json({message: "User not found"}, {status: 404})
        }

        console.log(" User Exists");

        const  validPassword = await bcryptjs.compare(password, user.password )

        if (!validPassword) {
            return NextResponse.json({message: "Invalid password"}, {status: 401})
        }


        const tokenData = {
            id: user._id,
            username: user.username,
            email: user.email,

        }

        const token =  await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {expiresIn: '1d'} )


        const response = NextResponse.json ({
            message: "Login successful",
            success: true
        })

        response.cookies.set("token", token, {
            httpOnly: true,
        } )

        return response







        
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
        
    }
}

