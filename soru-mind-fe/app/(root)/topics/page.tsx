import Link from 'next/link'
import { ArrowRight, Box, Calculator, Layers } from 'lucide-react'

const topics = [
  {
    id: 'exponents',
    title: 'Üslü Sayılar',
    description: 'Sayıların kuvvetlerini ve n³ mantığını 3D olarak keşfedin.',
    icon: Box,
    href: '/topics/exponents',
    color: 'bg-indigo-500',
    enabled: true,
  },
  {
    id: 'roots',
    title: 'Köklü Sayılar',
    description: 'Karekök ve küpkök kavramlarının görsel temsili.',
    icon: Layers,
    href: '#',
    color: 'bg-emerald-500',
    enabled: false,
  },
  {
    id: 'algebra',
    title: 'Cebirsel İfadeler',
    description: 'Değişkenler ve denklemler dünyasına adım atın.',
    icon: Calculator,
    href: '#',
    color: 'bg-orange-500',
    enabled: false,
  },
]

export default function TopicsPage() {
  return (
    <div className="container py-8 max-w-5xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Konular</h1>
        <p className="text-gray-500 text-lg">
          Matematik konularını interaktif 3D simülasyonlarla öğrenin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => (
          <div 
            key={topic.id} 
            className={`group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md ${!topic.enabled && 'opacity-60 grayscale'}`}
          >
            <div className="p-6">
              <div className={`w-12 h-12 rounded-lg ${topic.color} flex items-center justify-center mb-4 text-white shadow-sm`}>
                <topic.icon className="w-6 h-6" />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {topic.title}
              </h3>
              
              <p className="text-gray-500 mb-6 min-h-[48px]">
                {topic.description}
              </p>
              
              {topic.enabled ? (
                <Link 
                  href={topic.href}
                  className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  Keşfetmeye Başla
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              ) : (
                <span className="inline-flex items-center text-sm font-medium text-gray-400 cursor-not-allowed">
                  Yakında
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
