import ChatArea from "./components/Chatarea";
import Header from "./components/Header";

export default function Home() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-between">
      <Header />
      <ChatArea />
    </main>
  );
}
