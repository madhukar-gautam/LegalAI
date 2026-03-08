const BASE = process.env.BACKEND_URL || 'http://localhost:8080'
export async function fetchLawyers(query:Record<string,any>):Promise<any>{
  const url=new URL('/v1/lawyers',BASE); Object.entries(query).forEach(([k,v])=>{ if(v!==undefined && v!=='') url.searchParams.set(k,String(v)) })
  const res=await fetch(url,{ next:{ revalidate:30 } }); if(!res.ok) throw new Error('Failed to fetch lawyers'); return res.json()
}
export async function fetchPracticeAreas(): Promise<string[]> {
  const res = await fetch(`${BASE}/v1/lawyers/practice-areas`, { next: { revalidate: 120 } })
  if (!res.ok) throw new Error('Failed to fetch practice areas')
  return res.json()
}
export async function fetchCities(): Promise<string[]> {
  const res = await fetch(`${BASE}/v1/lawyers/cities`, { next: { revalidate: 120 } })
  if (!res.ok) throw new Error('Failed to fetch cities')
  return res.json()
}
export async function fetchLawyer(id:string|number):Promise<any>{
  const res=await fetch(`${BASE}/v1/lawyers/${id}`,{ next:{ revalidate:60 } }); if(!res.ok) throw new Error('Failed to fetch lawyer'); return res.json()
}
export async function createCheckout(booking:any){
  const res=await fetch(`${BASE}/v1/payments/checkout`,{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(booking) })
  if(!res.ok) throw new Error('Failed to create checkout'); return res.json()
}
