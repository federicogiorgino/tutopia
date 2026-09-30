import { CodeSnippetForm } from "@/components/forms/code-snippet-form";
import { SnippetsList } from "@/components/snippets-list";
import { getServerSession } from "@/lib/get-server-session";

export default async function CodeSnippetExamplePage() {
  const session = await getServerSession();
  return (
    <main className="w-full max-w-3xl min-w-0 px-6 py-12">
      <CodeSnippetForm />
      {session && <SnippetsList userId={session.user.id} />}
    </main>
  );
}
