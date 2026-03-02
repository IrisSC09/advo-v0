const BASE_URL = "https://www.googleapis.com/civicinfo/v2"
const API_KEY = process.env.GOOGLE_CIVIC_INFO_KEY
import { NextRequest, NextResponse } from "next/server"

export interface SocialMediaChannel {
    type: string
    id: string
}

export interface Address {
    line1?: string
    line2?: string
    line3?: string
    city?: string
    state?: string
    zip?: string
}

export interface Official {
    name: string
    party?: string
    phones?: string[]
    urls?: string[]
    emails?: string[]
    photoUrl?: string
    channels?: SocialMediaChannel[]
    address?: Address[]
}

export interface Office{
    name: string 
    divisionId: string
    levels?: string[]
    roles?: string[]
    officialIndices?: number[]
}

export interface RepresentativesResponse{
    offices: Office[]
    officials: Official[]
}

export interface Election{
    id: string
    name: string
    electionDay: string
    ocdDivisionId: string
}

export interface ElectionsResponse {
    elections: Election[]
  }
  
  export interface VoterInfoResponse {
    election: Election
    pollingLocations?: PollingLocation[]
    earlyVoteSites?: PollingLocation[]
    dropOffLocations?: PollingLocation[]
    contests?: Array<{ type?: string; office?: string; referendumTitle?: string }>
    state?: Array<{ electionAdministrationBody?: { electionInfoUrl?: string; electionRegistrationUrl?: string } }>
  }
  
  export interface PollingLocation {
    address: Address
    name?: string
    pollingHours?: string
    startDate?: string
    endDate?: string
  }

  //get reps for state
  export async function getRepresentatives(address: string): Promise<RepresentativesResponse> {
    const params = new URLSearchParams({
      key: API_KEY!,
      address,
    })
  
    const res = await fetch(`${BASE_URL}/representatives?${params}`)
    if (!res.ok) throw new Error(`Civic API error: ${res.status}`)
    return res.json()
  }

  //filter only federal - TEST 
  export function getFederalReps(data: RepresentativesResponse): { office: Office; official: Official }[] {
    const federal: { office: Office; official: Official }[] = []
  
    for (const office of data.offices) {
      const isFederal = office.levels?.includes("country")
      const isLegislator =
        office.roles?.includes("legislatorUpperBody") ||
        office.roles?.includes("legislatorLowerBody")
  
      if (isFederal && isLegislator) {
        for (const idx of office.officialIndices || []) {
          federal.push({ office, official: data.officials[idx] })
        }
      }
    }
  
    return federal
  }
  
  //social media 
  export function getSocialLinks(official: Official): Record<string, string> {
    const links: Record<string, string> = {}
  
    for (const channel of official.channels ?? []) {
      switch (channel.type) {
        case "Twitter":
          links.twitter = `https://twitter.com/${channel.id}`
          break
        case "Facebook":
          links.facebook = `https://facebook.com/${channel.id}`
          break
        case "YouTube":
          links.youtube = `https://youtube.com/${channel.id}`
          break
      }
    }
  
    return links
  }

  //available elections 
  export async function getElections(address: string): Promise<ElectionsResponse> {
    const params = new URLSearchParams({
      key: API_KEY!,
      address,
    })

    const res = await fetch(`${BASE_URL}/elections?${params}`)
    if (!res.ok) throw new Error(`Civic API error: ${res.status}`)
    return res.json()
  }

  export async function getVoterInfo(address: string, electionId: string): Promise<VoterInfoResponse> {
    const params = new URLSearchParams({ key: API_KEY!, address, electionId })
    const res = await fetch(`${BASE_URL}/voterinfo?${params}`)
    if (!res.ok) throw new Error(`Civic API error: ${res.status}`)
    return res.json()
  }

  export async function GET(request: NextRequest) {
    try {
      const address = request.nextUrl.searchParams.get("address")
      const electionId = request.nextUrl.searchParams.get("electionId")
      if (!address) return NextResponse.json({ error: "address is required" }, { status: 400 })
      const reps = await getRepresentatives(address)
      const elections = await getElections(address)
      const selectedElectionId = electionId || elections.elections?.[0]?.id
      const voterInfo = selectedElectionId ? await getVoterInfo(address, selectedElectionId) : null
      return NextResponse.json({ federalReps: getFederalReps(reps), elections: elections.elections || [], voterInfo })
    } catch (error) {
      console.error("google-civic-info error:", error)
      return NextResponse.json({ error: "Failed to fetch civic info" }, { status: 500 })
    }
  }