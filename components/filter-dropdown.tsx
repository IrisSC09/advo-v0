import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Filter } from "lucide-react"

export default function FilterDropdown() {
  return (
    <div className="flex gap-2">
      <Select>
        <SelectTrigger className="w-40 bg-gray-900 border-gray-700 text-white neon-border">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Scope" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 neon-border">
          <SelectItem value="local" className="text-white hover:bg-neon-purple hover:text-black">
            Local
          </SelectItem>
          <SelectItem value="regional" className="text-white hover:bg-neon-purple hover:text-black">
            Regional
          </SelectItem>
          <SelectItem value="state" className="text-white hover:bg-neon-purple hover:text-black">
            State
          </SelectItem>
          <SelectItem value="national" className="text-white hover:bg-neon-purple hover:text-black">
            National
          </SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-48 bg-gray-900 border-gray-700 text-white neon-border">
          <SelectValue placeholder="Issue" />
        </SelectTrigger>
        <SelectContent className="bg-gray-900 border-gray-700 neon-border">
          <SelectItem value="climate" className="text-white hover:bg-neon-purple hover:text-black">
            Climate Change
          </SelectItem>
          <SelectItem value="lgbtq" className="text-white hover:bg-neon-purple hover:text-black">
            LGBTQ+
          </SelectItem>
          <SelectItem value="immigration" className="text-white hover:bg-neon-purple hover:text-black">
            Immigration
          </SelectItem>
          <SelectItem value="education" className="text-white hover:bg-neon-purple hover:text-black">
            Education
          </SelectItem>
          <SelectItem value="politics" className="text-white hover:bg-neon-purple hover:text-black">
            Politicians
          </SelectItem>
          <SelectItem value="war" className="text-white hover:bg-neon-purple hover:text-black">
            International War
          </SelectItem>
          <SelectItem value="economics" className="text-white hover:bg-neon-purple hover:text-black">
            Economics/Finance
          </SelectItem>
          <SelectItem value="feminism" className="text-white hover:bg-neon-purple hover:text-black">
            Feminism/Women
          </SelectItem>
          <SelectItem value="mental-health" className="text-white hover:bg-neon-purple hover:text-black">
            Mental Health
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
