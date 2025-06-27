import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeeklyActivity {
  id: string
  projectName: string
  date: Date
  duration: number
}

interface WeeklyCalendarProps {
  activities: WeeklyActivity[]
}

export function WeeklyCalendar({ activities }: WeeklyCalendarProps) {
  const weekDays = ["MON", "TUE", "WED", "THU", "FRI"]
  const today = new Date()
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1))

  const getDayDate = (dayIndex: number) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + dayIndex)
    return date
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">THIS WEEK</CardTitle>
          <span className="text-sm text-gray-500">4-8 MAY</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-2">
          {weekDays.map((day, index) => {
            const dayDate = getDayDate(index)
            const dayActivities = activities.filter(
              (activity) => activity.date.toDateString() === dayDate.toDateString(),
            )

            return (
              <div key={day} className="text-center">
                <div className="text-xs text-gray-500 mb-2">{dayDate.getDate()}</div>
                <div className="h-20 bg-gray-100 rounded relative">
                  {dayActivities.map((activity, actIndex) => (
                    <div
                      key={activity.id}
                      className="absolute inset-x-1 bg-green-500 text-white rounded text-xs p-1 flex items-center justify-center"
                      style={{
                        top: `${actIndex * 25}%`,
                        height: "20px",
                      }}
                    >
                      <span className="truncate">{activity.projectName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
