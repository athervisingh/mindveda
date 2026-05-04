// Mock API route returning packages. Replace with Supabase queries later.
export default function handler(req, res){
  const packages = [
    { id:1, title:'Individual Counseling', excerpt:'One-on-one support', price:2499, slug:'individual-counseling' },
    { id:2, title:'Couples Therapy', excerpt:'Guided couples sessions', price:4999, slug:'couples-therapy' }
  ]
  res.status(200).json({ packages })
}
