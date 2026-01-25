'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Feedback {
  id: string
  staffRating: number
  serviceRating: number
  hygieneRating: number
  satisfactionEmoji: string | null
  phoneNumber: string | null
  tableNumber: string | null
  comment: string | null
  createdAt: string
}

export default function FeedbackPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchFeedbacks()
  }, [])

  const fetchFeedbacks = async () => {
    try {
      const response = await fetch('/api/admin/feedback')
      if (response.ok) {
        const data = await response.json()
        setFeedbacks(data.feedbacks || [])
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className="w-4 h-4"
            style={{
              fill: star <= rating ? '#FBBF24' : 'transparent',
              color: star <= rating ? '#FBBF24' : '#E5E7EB',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen p-2 sm:p-4" style={{ backgroundColor: '#F7F9F8' }}>
      <div className="max-w-6xl mx-auto">
        <div 
          className="admin-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6"
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D1D5DB',
            borderRadius: '0.75rem',
            padding: '1rem 1.5rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          }}
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: '#0F172A' }}>Customer Feedback</h1>
          <Button 
            onClick={() => router.push(`/${slug}/admin-portal`)} 
            style={{
              backgroundColor: '#27C499',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              padding: '0.5rem 1rem',
              fontWeight: '500',
              cursor: 'pointer',
              fontSize: '0.875rem',
              width: '100%',
            }}
            className="sm:w-auto"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#20B08A'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27C499'}
          >
            Back
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12" style={{ color: '#475569' }}>Loading feedback...</div>
        ) : feedbacks.length === 0 ? (
          <div 
            className="admin-card rounded-2xl p-12 text-center"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D1D5DB',
              color: '#475569',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
            }}
          >
            No feedback received yet
          </div>
        ) : (
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="admin-card rounded-2xl p-6 transition-all"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D1D5DB',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm mb-1" style={{ color: '#475569' }}>Staff</div>
                        {renderStars(feedback.staffRating)}
                      </div>
                      <div>
                        <div className="text-sm mb-1" style={{ color: '#475569' }}>Service</div>
                        {renderStars(feedback.serviceRating)}
                      </div>
                      <div>
                        <div className="text-sm mb-1" style={{ color: '#475569' }}>Hygiene</div>
                        {renderStars(feedback.hygieneRating)}
                      </div>
                    </div>
                    {feedback.satisfactionEmoji && (
                      <div className="text-2xl mb-2">{feedback.satisfactionEmoji}</div>
                    )}
                    {feedback.comment && (
                      <p className="mb-2" style={{ color: '#0F172A' }}>
                        {feedback.comment}
                      </p>
                    )}
                    <div className="flex gap-4 text-sm" style={{ color: '#94A3B8' }}>
                      {feedback.phoneNumber && (
                        <span>Phone: {feedback.phoneNumber}</span>
                      )}
                      {feedback.tableNumber && (
                        <span>Table: {feedback.tableNumber}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm" style={{ color: '#94A3B8' }}>
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

