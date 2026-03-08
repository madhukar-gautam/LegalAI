import { NextRequest, NextResponse } from 'next/server'
export async function POST(req: NextRequest) {
  const body = await req.json()
  const backend = process.env.BACKEND_URL || 'http://localhost:8080'
  const res = await fetch(`${backend}/v1/chatbot/message`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ message: body.message ?? body.description, city: body.city })
  })
  if (!res.ok) return NextResponse.json({ error: 'backend failed' }, { status: 500 })
  const data = await res.json()
  return NextResponse.json(data)
}
