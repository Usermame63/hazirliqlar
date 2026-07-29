import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const { to, otp } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Hazırlıqlar Platforması" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: '🔐 Təhlükəsizlik Kodunuz',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
          <h2 style="color: #2563eb;">Hazırlıqlar Platformasına Giriş</h2>
          <p style="font-size: 16px; color: #475569;">Hesabınıza daxil olmaq üçün təsdiq kodunuz:</p>
          <div style="font-size: 32px; font-weight: bold; background: #f1f5f9; padding: 15px; border-radius: 10px; letter-spacing: 5px; color: #0f172a; width: fit-content; margin: 0 auto;">
            ${otp}
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Mail xətası:", error);
    return NextResponse.json({ error: 'Mail göndərilmədi' }, { status: 500 });
  }
}