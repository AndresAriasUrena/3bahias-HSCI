// src/app/page.tsx
import FirebaseMonitor from '@/components/firebase-monitor';

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <FirebaseMonitor />
    </main>
  );
}