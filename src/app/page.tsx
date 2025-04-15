// app/page.tsx
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>🎒 TrailMatch</CardTitle>
          <p className="text-sm text-muted-foreground">Find the perfect trail for your weekend vibe.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input placeholder="Enter your city or zip" />
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="How much time do you have?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="<1hr">Less than 1 hour</SelectItem>
              <SelectItem value="1-2hr">1–2 hours</SelectItem>
              <SelectItem value="2+hr">2+ hours</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Pick a vibe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="scenic">Scenic</SelectItem>
              <SelectItem value="low-traffic">Low traffic</SelectItem>
              <SelectItem value="dog-friendly">Dog-friendly</SelectItem>
              <SelectItem value="kid-friendly">Kid-friendly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="w-full">Find Trails</Button>
        </CardContent>
      </Card>
    </main>
  )
}
