import { NextResponse } from 'next/server'

const BACKEND = process.env.BACKEND_URL || 'http://localhost:8080'

export async function POST(req: Request) {
  let payload: unknown
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 })
  }

  const response = await fetch(`${BACKEND}/v1/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const text = await response.text()
  const contentType = response.headers.get('content-type') || ''

  if (contentType.includes('application/json')) {
    const data = text ? JSON.parse(text) : {}
    return NextResponse.json(data, { status: response.status })
  }

  return NextResponse.json({ message: text || 'Unexpected response' }, { status: response.status })
}
