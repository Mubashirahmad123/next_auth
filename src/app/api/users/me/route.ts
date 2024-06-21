import { connect } from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from 'next/server';

import { getDataFromToken } from "@/helpers/getDatafromToken";



connect()

export async function POST(request: NextRequest) {

    // Extract data from token

     const userId = await getDataFromToken(request)

     const user = await User.findOne({_id: userId}).select("-password")


     // check if there is no user 

     return NextResponse.json({
        message: "User Found",
        data: user
     })



    }











