//api/bills/route.ts
export interface BillDetail {
    bill_id: number
    title: string
    description: string
    introduced_date: string
    sponsor_name: string
    state: string
    bill_number: string
    status: string
    status_date?: string
    last_action_date?: string
    progress?: Array<{
      date: string
      event: string
    }>
    committee?: string
    next_action?: string
    sponsors?: Array<{
      people_id: number
      name: string
      first_name: string
      last_name: string
      party: string
      role: string
    }>
    subjects?: string[]
    history?: Array<{
      date: string
      action: string
      chamber: string
    }>
    votes?: Array<{
      roll_call_id: number
      date: string
      desc: string
      yea: number
      nay: number
      nv: number
      absent: number
      total: number
      passed: number
      vote_url?: string
    }>
    texts?: Array<{
      doc_id: number
      type: string
      mime: string
      url: string
      state_link: string
      text_size: number
    }>
    amendments?: Array<{
      amendment_id: number
      chamber: string
      number: string
      description: string
      status: string
    }>
    supplements?: Array<{
      supplement_id: number
      type: string
      title: string
      description: string
    }>
  }
  
  export interface BillsResponse {
    bills: BillDetail[]
    total: number
    page: number
    limit: number
    hasMore: boolean
  }
//bill/[id]/page.tsx
export interface Thread {
  id: string;
  title: string;
  content: {text: string;
            file_url: string;
  };
  type: string;
  bill_id: string
  author_id: string;
  tags: string[];
  likes_count: number;
  shares_count: number;
  comments_count: number;
  created_at: string;
  profiles: { username: string; 
              full_name?: string; 
              avatar_url?: string | null };
  bill_title?: string
}

export interface AISummary {
  summary: string;
  keyPoints: string[];
  impact: string;
  controversialAspects: string;
}

export interface Sentiment {
  support: number;
  oppose: number;
  neutral: number;
  overallSentiment: string;
  keyThemes: string[];
  summary: string;
}
export interface Comment {
  id: string
  content: string
  created_at: string
  profiles: {
    username: string
    full_name: string
    avatar_url: string | null
  }
}
  //google-civic-info/route.ts
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
//search/route.ts
export interface SearchResult {
  relevance: number
  state: string
  bill_number: string
  bill_id: number
  change_hash: string
  url: string
  text_url: string
  research_url: string
  last_action_date: string
  last_action: string
  title: string
}

export interface SearchResponse {
  results: SearchResult[]
  summary: {
    count: number
    page: number
    total_pages: number
  }
}