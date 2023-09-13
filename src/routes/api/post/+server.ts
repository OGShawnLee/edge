

export function POST(event) {
  const text = event.request.text();

  return new Response("Got it!");
}