"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function TakeActionModal({
  initialAddress = "",
}: {
  initialAddress?: string;
}) {
  const [open, setOpen] = useState(false);
  const [address, setAddress] = useState(initialAddress);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!address.trim()) return;
    setLoading(true);
    const res = await fetch(
      `/api/google-civic-info?address=${encodeURIComponent(address)}`,
    );
    setData(await res.json());
    setLoading(false);
  };

  useEffect(() => {
    setAddress(initialAddress || "");
  }, [initialAddress]);

  useEffect(() => {
    if (open && address && !data && !loading) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {/* add once fixed- <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 bg-transparent" onClick={() => setOpen(true)}>
        Take Action!
      </Button> */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 overflow-auto">
          <div className="max-w-2xl mx-auto mt-12">
            <Card className="bg-gray-900 border-gray-700">
              {/* <add once fixed- CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-white">Take Action</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => setOpen(false)} className="text-gray-300">Close</Button>
              </CardHeader> */}
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter address (city, state, zip)"
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <Button
                    onClick={load}
                    className="bg-advoline-orange hover:bg-advoline-orange/90 text-black"
                  >
                    {loading ? "Loading..." : "Lookup"}
                  </Button>
                </div>
                {data?.federalReps?.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-white font-semibold">Representatives</p>
                    {data.federalReps.map((r: any, i: number) => (
                      <div key={i} className="text-sm text-gray-300">
                        <div>
                          {r.office?.name}: {r.official?.name}
                        </div>
                        {r.official?.emails?.[0] && (
                          <a
                            className="text-advoline-orange"
                            href={`mailto:${r.official.emails[0]}`}
                          >
                            Email representative
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                {data?.elections?.length > 0 && (
                  <div className="text-sm text-gray-300">
                    <p className="text-white font-semibold">
                      Upcoming Elections
                    </p>
                    {data.elections.slice(0, 3).map((e: any) => (
                      <div key={e.id}>
                        {e.name} - {e.electionDay}
                      </div>
                    ))}
                  </div>
                )}
                {data?.voterInfo && (
                  <div className="text-sm text-gray-300 space-y-1">
                    <p className="text-white font-semibold">Voting Info</p>
                    <div>
                      Polling locations:{" "}
                      {data.voterInfo.pollingLocations?.length || 0}
                    </div>
                    <div>
                      Early vote sites:{" "}
                      {data.voterInfo.earlyVoteSites?.length || 0}
                    </div>
                    <div>
                      Drop box locations:{" "}
                      {data.voterInfo.dropOffLocations?.length || 0}
                    </div>
                    <div>
                      Ballot measures:{" "}
                      {
                        (data.voterInfo.contests || []).filter(
                          (c: any) => c.type === "Referendum",
                        ).length
                      }
                    </div>
                    <div>
                      Contests/candidates:{" "}
                      {data.voterInfo.contests?.length || 0}
                    </div>
                    {data.voterInfo.state?.[0]?.electionAdministrationBody
                      ?.electionRegistrationUrl && (
                      <a
                        className="text-advoline-orange"
                        href={
                          data.voterInfo.state[0].electionAdministrationBody
                            .electionRegistrationUrl
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Voter registration deadlines / election contacts
                      </a>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
