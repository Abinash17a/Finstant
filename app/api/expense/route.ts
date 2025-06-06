import { PrismaClient, TransactionCategory, TransactionType } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      user_id,
      amount,
      date,
      category,
      sub_category,
      payment_method,
      description,
      location,
      tags,
      type,
    } = body;

    if (!user_id || !amount || !category || !type) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newTransaction = await prisma.transactions.create({
      data: {
        user_id,
        amount: parseFloat(amount),
        date: new Date(date),
        category: category.toUpperCase() as TransactionCategory,
        sub_category,
        payment_method,
        description,
        location,
        tags,
        type: type.toUpperCase() as TransactionType,
      },
    });

    return NextResponse.json({ success: true, transaction: newTransaction }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
