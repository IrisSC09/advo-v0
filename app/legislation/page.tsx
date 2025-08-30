import BillsFeed from "@/components/BillsFeed";

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Latest U.S. Federal Bills</h1>
      <BillsFeed />
    </main>
  );
}
