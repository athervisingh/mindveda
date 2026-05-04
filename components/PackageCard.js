import Link from 'next/link'

export default function PackageCard({ pkg }){
  return (
    <div className="bg-white rounded-xl shadow-soft p-6 hover:shadow-xl transition-shadow duration-200">
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center text-brand">Img</div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{pkg.title}</h3>
          <p className="text-sm text-gray-500 mt-2">{pkg.excerpt}</p>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-brand font-semibold">₹{pkg.price}</div>
            <Link href={`/packages/${pkg.slug}`} className="text-sm text-indigo-600">View</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
