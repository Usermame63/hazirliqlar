import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { image } = await req.json();
        const base64Data = image.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');

        const token = '8460810688:AAGRom4XWoWXjhtRk6JM2ESwsphr5tLLs6k';
        const chatId = '6711935979';

        const form = new FormData();
        form.append('chat_id', chatId);
        form.append('photo', new Blob([buffer], { type: 'image/jpeg' }), 'foto.jpg');

        const res = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method: 'POST',
            body: form,
        });

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err) {
        return NextResponse.json({ ok: false, description: String(err) });
    }
}