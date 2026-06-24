import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    console.log("===== Financial Goal Save API =====");

    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const user_id = decoded.userId;

    const body = await req.json();

    const {
      id,
      name,
      target,
      current,
    } = body;

    console.log("Decoded User:", user_id);
    console.log("Request Body:", body);

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          message: "Goal name is required",
        },
        { status: 400 }
      );
    }

    const result = await prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM usp_financialgoal_insupd(
        $1::uuid,
        $2::text,
        $3::numeric,
        $4::numeric,
        $5::uuid
      )
      `,
      user_id,
      name,
      target,
      current,
      id || null
    );

    console.log("Financial Goal Saved:", result);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Financial Goal Save Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const decoded: any = jwt.verify(
      token,
      process.env.JWT_SECRET!
    );

    const user_id = decoded.userId;

    const result = await prisma.$queryRawUnsafe(
      `
      SELECT *
      FROM usp_financialgoal_sel(
        $1::uuid
      )
      `,
      user_id
    );

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Financial Goal Get Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

