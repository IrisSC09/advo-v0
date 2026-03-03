"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart2,
  ThumbsUp,
  ThumbsDown,
  Minus,
  MessageSquare,
  AlertCircle,
  ArrowLeft,
  Share2,
  Bookmark,
  Users,
  Music,
  FileText,
  Palette,
  Calendar,
  User,
  Vote,
  ScrollText,
  FileEdit,
  Plus,
  ExternalLink,
  Copy,
  Check,
  X,
  Sparkles,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import TakeActionModal from "@/components/take-action-modal";
import { BillDetail, Thread, AISummary, Sentiment } from "@/app/interfaces";

export default function BillDetailPage() {
  const params = useParams();
  const [bill, setBill] = useState<BillDetail | null>(null);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null);
  const [sentiment, setSentiment] = useState<Sentiment | null>(null);
  const [aiError, setAiError] = useState("");
  const [aiUsage, setAiUsage] = useState<{
    used: number;
    limit: number;
    remaining: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [threadsLoading, setThreadsLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAllSponsors, setShowAllSponsors] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user, profile } = useAuth();
  const summaryRequestKeyRef = useRef("");

  useEffect(() => {
    fetchBillDetail();
    fetchThreads();
  }, [params.id]);

  const toAiBillText = (billData: BillDetail) =>
    [
      billData.description,
      billData.history?.map((h) => `${h.date}: ${h.action}`).join("\n"),
      billData.amendments
        ?.map((a) => `${a.number}: ${a.description}`)
        .join("\n"),
      billData.supplements
        ?.map((s) => `${s.title}: ${s.description || ""}`)
        .join("\n"),
      billData.votes
        ?.map(
          (v) =>
            `${v.desc} (Yea ${v.yea}, Nay ${v.nay}, NV ${v.nv}, Absent ${v.absent})`,
        )
        .join("\n"),
      billData.texts
        ?.map((t) => `${t.type} ${t.state_link || t.url || ""}`)
        .join("\n"),
    ]
      .filter(Boolean)
      .join("\n\n");

  useEffect(() => {
    if (
      !bill ||
      threads.length === 0 ||
      user?.email !== "iris.cao2009@gmail.com"
    )
      return;
    (async () => {
      const response = await fetch("/api/ai/sentiment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billTitle: bill.title,
          threadContent: threads.map((t) => t.content),
          userEmail: user?.email,
        }),
      });
      if (response.ok) setSentiment(await response.json());
    })();
  }, [bill, threads, user?.email]);

  const fetchBillDetail = async () => {
    try {
      const response = await fetch(`/api/bills/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBill(data);
        const requestKey = `${data.bill_id}:${user?.id || "anon"}`;
        if (
          data.description &&
          user &&
          summaryRequestKeyRef.current !== requestKey
        ) {
          summaryRequestKeyRef.current = requestKey;
          generateAISummary(data);
        }
      }
    } catch (error) {
      console.error("Error fetching bill detail:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreads = async () => {
    try {
      const response = await fetch(`/api/threads?bill_id=${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads || []);
      }
    } catch (error) {
      console.error("Error fetching threads:", error);
    } finally {
      setThreadsLoading(false);
    }
  };

  const generateAISummary = async (billData: BillDetail) => {
    if (!user) {
      setAiError("Sign in to generate AI analysis.");
      return;
    }
    setAiLoading(true);
    setAiError("");
    try {
      const response = await fetch("/api/ai/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          billText: toAiBillText(billData),
          billTitle: billData.title,
          billId: billData.bill_id,
          userId: user.id,
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setAiSummary(data.summary ?? null);
        setAiUsage(data.usage || null);
      } 
    } catch (error) {
      console.error("Error generating AI summary:", error);
      setAiError("AI analysis unavailable");
    } finally {
      setAiLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "zine":
        return FileText;
      case "music":
        return Music;
      case "art":
        return Palette;
      case "blog":
        return FileText;
      default:
        return FileText;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "zine":
        return "bg-purple-500";
      case "music":
        return "bg-green-500";
      case "art":
        return "bg-pink-500";
      case "blog":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPartyColor = (party: string) => {
    switch (party?.toLowerCase()) {
      case "democrat":
      case "d":
        return "bg-blue-500";
      case "republican":
      case "r":
        return "bg-red-500";
      case "independent":
      case "i":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getSubjectColor = (subject: string, index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-orange-500",
      "bg-teal-500",
      "bg-cyan-500",
    ];
    let hash = 0;
    for (let i = 0; i < subject.length; i++) {
      hash = subject.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const formatChamber = (chamber: string) => {
    switch (chamber?.toLowerCase()) {
      case "s":
      case "senate":
        return "Senate";
      case "h":
      case "house":
        return "House of Representatives";
      default:
        return chamber;
    }
  };

  const handleCopyLink = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const ShareModal = () => {
    if (!showShareModal) return null;
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <Card className="bg-gray-900 border-gray-800 w-full max-w-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Share Bill</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-white text-sm font-medium mb-2 block">
                  Share Link
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-gray-800 rounded border border-gray-700 text-gray-300 text-sm break-all">
                    {window.location.href}
                  </div>
                  <Button
                    onClick={handleCopyLink}
                    className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                  >
                    {copied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {copied && (
                  <p className="text-green-400 text-sm mt-1">
                    Link copied to clipboard!
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-white">Loading bill details...</div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Bill Not Found</h2>
          <Link href="/legislation">
            <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
              Back to Legislation
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const latestHistoryItem = bill.history?.[0];
  const displayedSponsors = showAllSponsors
    ? bill.sponsors
    : bill.sponsors?.slice(0, 3);
  const hasMoreSponsors = bill.sponsors && bill.sponsors.length > 3;

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link
          href="/legislation"
          className="inline-flex items-center text-gray-400 hover:text-white mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Legislation
        </Link>

        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  {bill.sponsors?.[0]?.party && (
                    <Badge
                      className={`${getPartyColor(bill.sponsors[0].party)} text-white`}
                    >
                      {bill.sponsors[0].party}
                    </Badge>
                  )}
                  {bill.subjects?.slice(0, 3).map((subject, index) => (
                    <Badge
                      key={index}
                      className={`${getSubjectColor(subject, index)} text-white`}
                    >
                      {subject}
                    </Badge>
                  ))}
                  <Badge className="bg-gray-700 text-gray-300">
                    {bill.status}
                  </Badge>
                </div>
                <h1 className="text-3xl font-black text-white mb-2">
                  {bill.title}
                </h1>
                <p className="text-gray-400 mb-4">
                  {bill.bill_number} • Sponsored by {bill.sponsor_name} •
                  Introduced{" "}
                  {new Date(bill.introduced_date).toLocaleDateString()}
                </p>
                <p className="text-gray-300 leading-relaxed">
                  {bill.description}
                </p>
              </div>
              <div className="flex gap-2 ml-4">
                <TakeActionModal
                  initialAddress={profile?.state ? `${profile.state}, US` : ""}
                />
                <Button
                  variant="outline"
                  onClick={async () => {
                    if (!user) return;
                    if (isFollowing)
                      await fetch(
                        `/api/bill-follows?user_id=${user.id}&bill_id=${bill.bill_id}`,
                        { method: "DELETE" },
                      );
                    else
                      await fetch("/api/bill-follows", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          user_id: user.id,
                          bill_id: String(bill.bill_id),
                        }),
                      });
                    setIsFollowing(!isFollowing);
                  }}
                  className={`border-gray-600 ${isFollowing ? "bg-advoline-orange border-advoline-orange text-black" : "text-gray-400 hover:text-white"} bg-transparent`}
                >
                  <Bookmark
                    className={`h-4 w-4 ${isFollowing ? "fill-current" : ""}`}
                  />
                  {isFollowing ? "Following" : "Follow"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowShareModal(true)}
                  className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6 bg-gray-900 border-gray-800">
                <TabsTrigger
                  value="overview"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Text
                </TabsTrigger>
                <TabsTrigger
                  value="votes"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Votes
                </TabsTrigger>
                <TabsTrigger
                  value="amendments"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Amendments
                </TabsTrigger>
                <TabsTrigger
                  value="supplements"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Supplements
                </TabsTrigger>
                <TabsTrigger
                  value="threads"
                  className="text-white data-[state=active]:bg-advoline-orange data-[state=active]:text-black"
                >
                  Threads ({threads.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-gradient-to-br bg-gray-900 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Sparkles className="h-5 w-5 text-purple-400 mr-2" />
                      AI-Powered Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {aiLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 text-purple-400 animate-spin" />
                        <span className="ml-3 text-gray-300">
                          Analyzing bill with AI...
                        </span>
                      </div>
                    ) : aiSummary ? (
                      <div className="space-y-4">
                        {aiUsage && (
                          <div className="rounded-md bg-purple-500/10 border border-purple-500/30 px-3 py-2 text-sm text-purple-200">
                            AI analyses today: {aiUsage.used}/{aiUsage.limit} (
                            {aiUsage.remaining} remaining)
                          </div>
                        )}
                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            <span className="text-purple-400 mr-2">📄</span>
                            Summary
                          </h4>
                          <p className="text-gray-300 leading-relaxed">
                            {aiSummary.summary}
                          </p>
                        </div>

                        <div>
                          <h4 className="text-white font-semibold mb-2 flex items-center">
                            <span className="text-purple-400 mr-2">🎯</span>
                            Key Points
                          </h4>
                          <ul className="space-y-2">
                            {(aiSummary.keyPoints ?? []).map((point, index) => (
                              <li
                                key={index}
                                className="text-gray-300 flex items-start"
                              >
                                <span className="text-advoline-orange mr-2 mt-1">
                                  •
                                </span>
                                {typeof point === "string" ? point : String(point)}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-gray-700">
                          <p className="text-xs text-gray-500 flex items-center">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Powered by AI • Analysis may not be 100% accurate
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400 mb-4">
                          {aiError ||
                            (user
                              ? "AI analysis unavailable"
                              : "Sign in to generate AI analysis")}
                        </p>
                        <Button
                          disabled={!user}
                          onClick={() => generateAISummary(bill)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate AI Summary
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {sentiment && (
                  <Card className="bg-gray-950 border border-gray-800 rounded-2xl overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2 text-base font-semibold">
                        <BarChart2 className="w-4 h-4 text-blue-400" />
                        Community Sentiment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-green-950/60 border border-green-900/50 rounded-xl p-3 flex flex-col items-center gap-1">
                          <ThumbsUp className="w-5 h-5 text-green-400" />
                          <span className="text-white text-xl font-bold">
                            {sentiment.support}%
                          </span>
                          <span className="text-green-400 text-xs">
                            Supporters
                          </span>
                        </div>
                        <div className="bg-red-950/60 border border-red-900/50 rounded-xl p-3 flex flex-col items-center gap-1">
                          <ThumbsDown className="w-5 h-5 text-red-400" />
                          <span className="text-white text-xl font-bold">
                            {sentiment.oppose}%
                          </span>
                          <span className="text-red-400 text-xs">
                            Dissenters
                          </span>
                        </div>
                        <div className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-3 flex flex-col items-center gap-1">
                          <Minus className="w-5 h-5 text-gray-400" />
                          <span className="text-white text-xl font-bold">
                            {sentiment.neutral}%
                          </span>
                          <span className="text-gray-400 text-xs">Neutral</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-gray-400 text-xs">
                            Overall Sentiment
                          </span>
                          <span
                            className={`text-xs font-semibold ${sentiment.support > sentiment.oppose ? "text-green-400" : sentiment.oppose > sentiment.support ? "text-red-400" : "text-yellow-400"}`}
                          >
                            {sentiment.support > sentiment.oppose
                              ? "Positive"
                              : sentiment.oppose > sentiment.support
                                ? "Negative"
                                : "Mixed"}
                          </span>
                        </div>
                        <div className="flex h-2 rounded-full overflow-hidden gap-0.5">
                          <div
                            className="bg-green-500 rounded-l-full transition-all"
                            style={{ width: `${sentiment.support}%` }}
                          />
                          <div
                            className="bg-red-500 transition-all"
                            style={{ width: `${sentiment.oppose}%` }}
                          />
                          <div
                            className="bg-gray-600 rounded-r-full transition-all"
                            style={{ width: `${sentiment.neutral}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-gray-500 text-xs mt-1">
                          <span>Support</span>
                          <span>Oppose</span>
                          <span>Neutral</span>
                        </div>
                      </div>
                      <div className="border-t border-gray-800 pt-3 space-y-2">
                        <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Analysis Summary
                        </div>
                        <p className="text-gray-300 text-xs leading-relaxed">
                          {sentiment.summary}
                        </p>
                      </div>
                      {!!sentiment.keyThemes?.length && (
                        <div className="border-t border-gray-800 pt-3 space-y-2">
                          <div className="flex items-center gap-1.5 text-orange-400 text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Common Themes
                          </div>
                          {sentiment.keyThemes.map((theme, i) => (
                            <span key={i} className="text-gray-300 text-xs">
                              {theme}
                              {i < sentiment.keyThemes.length - 1 ? ", " : ""}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}

                {bill.sponsors && bill.sponsors.length > 0 && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <User className="h-5 w-5 mr-2" />
                        Sponsors
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {displayedSponsors?.map((sponsor, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                          >
                            <div>
                              <p className="text-white font-medium">
                                {sponsor.name}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {sponsor.role}
                              </p>
                            </div>
                            {sponsor.party && (
                              <Badge
                                className={`${getPartyColor(sponsor.party)} text-white`}
                              >
                                {sponsor.party}
                              </Badge>
                            )}
                          </div>
                        ))}
                        {hasMoreSponsors && !showAllSponsors && (
                          <Button
                            onClick={() => setShowAllSponsors(true)}
                            variant="outline"
                            className="w-full border-gray-600 text-gray-400 hover:text-white bg-transparent"
                          >
                            Load More Sponsors ({bill.sponsors.length - 3} more)
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {bill.history && bill.history.length > 0 && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Legislative History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {bill.history.slice(0, 10).map((item, index) => (
                          <div
                            key={index}
                            className="flex gap-4 p-3 bg-gray-800 rounded-lg"
                          >
                            <div className="text-gray-400 text-sm min-w-[100px]">
                              {new Date(item.date).toLocaleDateString()}
                            </div>
                            <div className="flex-1">
                              <p className="text-white">{item.action}</p>
                              {item.chamber && (
                                <p className="text-gray-400 text-sm">
                                  {formatChamber(item.chamber)}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="text" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <ScrollText className="h-5 w-5 mr-2" />
                      Bill Text Versions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.texts && bill.texts.length > 0 ? (
                      <div className="space-y-3">
                        {bill.texts.map((text, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
                          >
                            <div>
                              <p className="text-white font-medium">
                                {text.type}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {text.mime} •{" "}
                                {(text.text_size / 1024).toFixed(1)}KB
                              </p>
                            </div>
                            <div className="flex gap-2">
                              {text.state_link && (
                                <Button
                                  size="sm"
                                  className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold"
                                  asChild
                                >
                                  <a
                                    href={text.state_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View Official Text
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </a>
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">
                        No text versions available
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="votes" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Vote className="h-5 w-5 mr-2" />
                      Roll Call Votes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.votes && bill.votes.length > 0 ? (
                      <div className="space-y-4">
                        {bill.votes.map((vote, index) => (
                          <div
                            key={index}
                            className="p-4 bg-gray-800 rounded-lg"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <p className="text-white font-medium">
                                  {vote.desc}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  {new Date(vote.date).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={
                                    vote.passed ? "bg-green-500" : "bg-red-500"
                                  }
                                >
                                  {vote.passed ? "PASSED" : "FAILED"}
                                </Badge>
                                {vote.vote_url && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-gray-600"
                                    asChild
                                  >
                                    <a
                                      href={vote.vote_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-4 text-center">
                              <div>
                                <p className="text-green-400 font-bold text-lg">
                                  {vote.yea}
                                </p>
                                <p className="text-gray-400 text-sm">Yea</p>
                              </div>
                              <div>
                                <p className="text-red-400 font-bold text-lg">
                                  {vote.nay}
                                </p>
                                <p className="text-gray-400 text-sm">Nay</p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold text-lg">
                                  {vote.nv}
                                </p>
                                <p className="text-gray-400 text-sm">
                                  Not Voting
                                </p>
                              </div>
                              <div>
                                <p className="text-gray-400 font-bold text-lg">
                                  {vote.absent}
                                </p>
                                <p className="text-gray-400 text-sm">Absent</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No votes recorded</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="amendments" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <FileEdit className="h-5 w-5 mr-2" />
                      Amendments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.amendments && bill.amendments.length > 0 ? (
                      <div className="space-y-3">
                        {bill.amendments.map((amendment, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-800 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="text-white font-medium">
                                  {formatChamber(amendment.chamber)} Amendment{" "}
                                  {amendment.number}
                                </p>
                                <p className="text-gray-300 text-sm mt-1">
                                  {amendment.description}
                                </p>
                              </div>
                              <Badge className="bg-gray-700 text-gray-300">
                                {amendment.status}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No amendments available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="supplements" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Plus className="h-5 w-5 mr-2" />
                      Supplements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {bill.supplements && bill.supplements.length > 0 ? (
                      <div className="space-y-3">
                        {bill.supplements.map((supplement, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-800 rounded-lg"
                          >
                            <p className="text-white font-medium">
                              {supplement.title}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {supplement.type}
                            </p>
                            {supplement.description && (
                              <p className="text-gray-300 text-sm mt-1">
                                {supplement.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400">No supplements available</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="threads" className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-white">
                        Community Threads ({threads.length})
                      </CardTitle>
                      <Link href={`/bill/${bill.bill_id}/create-thread`}>
                        <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                          Create Thread
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {threadsLoading ? (
                      <div className="text-gray-400 text-center py-8">
                        Loading threads...
                      </div>
                    ) : threads.length > 0 ? (
                      <div className="space-y-4">
                        {threads.map((thread) => {
                          const TypeIcon = getTypeIcon(thread.type);
                          return (
                            <Card
                              key={thread.id}
                              className="bg-gray-800 border-gray-700"
                            >
                              <CardContent className="p-4">
                                <div className="flex gap-4">
                                  <Avatar className="h-10 w-10">
                                    <AvatarImage
                                      src={
                                        thread.profiles.avatar_url ||
                                        "/placeholder.svg"
                                      }
                                    />
                                    <AvatarFallback className="bg-advoline-orange text-black">
                                      {thread.profiles.username?.[0]?.toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge
                                        className={`${getTypeColor(thread.type)} text-white text-xs`}
                                      >
                                        <TypeIcon className="h-3 w-3 mr-1" />
                                        {thread.type}
                                      </Badge>
                                      <span className="text-gray-400 text-sm">
                                        by {thread.profiles.username}
                                      </span>
                                      <span className="text-gray-500 text-sm">
                                        {new Date(
                                          thread.created_at,
                                        ).toLocaleDateString()}
                                      </span>
                                    </div>

                                    <h4 className="text-white font-semibold mb-2">
                                      {thread.title}
                                    </h4>
                                    {/* <p className="text-gray-400 text-sm mb-3">{thread.content.text?.substring(0, 200)}...</p> */}

                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-4 text-gray-400 text-sm">
                                        <span>{thread.likes_count} likes</span>
                                        <span>
                                          {thread.shares_count} shares
                                        </span>
                                        <span>
                                          {thread.comments_count} comments
                                        </span>
                                      </div>
                                      <Link href={`/threads/${thread.id}`}>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="border-gray-600 text-gray-400 hover:text-white bg-transparent"
                                        >
                                          View Thread
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">
                          No threads yet for this bill
                        </p>
                        <Link href={`/bill/${bill.bill_id}/create-thread`}>
                          <Button className="bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                            Be the First to Create a Thread
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Bill Status</CardTitle>
              </CardHeader>
              <CardContent>
                {latestHistoryItem ? (
                  <div>
                    <span className="text-gray-400 text-sm">Last Update:</span>
                    <p className="text-white font-medium mb-2">
                      {latestHistoryItem.action}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {new Date(latestHistoryItem.date).toLocaleDateString()}
                      {latestHistoryItem.chamber &&
                        ` • ${formatChamber(latestHistoryItem.chamber)}`}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400">No status updates available</p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-neon-purple" />
                      <span className="text-gray-400">Active Threads</span>
                    </div>
                    <span className="text-white font-bold">
                      {threads.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-advoline-orange" />
                      <span className="text-gray-400">Contributors</span>
                    </div>
                    <span className="text-white font-bold">
                      {new Set(threads.map((t) => t.author_id)).size}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white">Take Action</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href={`/bill/${bill.bill_id}/create-thread`}>
                  <Button className="w-full bg-advoline-orange hover:bg-advoline-orange/90 text-black font-bold">
                    Create Thread
                  </Button>
                </Link>
                <Button
                  onClick={() => setShowShareModal(true)}
                  className="w-full neon-button text-black font-bold"
                >
                  Share on Social
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <ShareModal />
      </div>
    </div>
  );
}
