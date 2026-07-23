import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

export function StatisticCard({ text, icon, value, description, color }: { text: string, icon: any, value: string | number, description: string, color?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{text}</CardTitle>
              {icon}
            </CardHeader>
            <CardContent>
              <div className={"text-2xl font-bold " + color}>{value}</div>
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            </CardContent>
          </Card>
    )
}